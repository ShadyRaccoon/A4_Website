using a4_backend.Data;
using a4_backend.DTOs;
using a4_backend.Models;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Bureau,Admin")]
public class DepartmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public DepartmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _context.Departments
            .Select(d => new { d.DepartmentId, d.Name, d.Alias })
            .ToListAsync();
        return Ok(departments);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dept = await _context.Departments.FindAsync(id);
        if (dept == null) return NotFound();
        return Ok(new { dept.DepartmentId, dept.Name, dept.Alias });
    }

    [HttpGet("{id:int}/members")]
    public async Task<IActionResult> GetMembers(int id)
    {
        var members = await _context.DepartmentMembers
            .Where(dm => dm.DepartmentId == id)
            .Include(dm => dm.Member)
            .Select(dm => new
            {
                dm.Member.MemberId,
                dm.Member.FirstName,
                dm.Member.LastName,
                dm.Member.Email,
                JoinDate = dm.JoinDate,
                LeaveDate = dm.LeaveDate
            })
            .ToListAsync();

        var sorted = members
            .OrderBy(m => m.LeaveDate.HasValue)
            .ThenByDescending(m => m.JoinDate)
            .ToList();

        return Ok(sorted);
    }

    [HttpGet("{id:int}/available-members")]
    public async Task<IActionResult> GetAvailableMembers(int id)
    {
        var currentMemberIds = await _context.DepartmentMembers
            .Where(dm => dm.DepartmentId == id && dm.LeaveDate == null)
            .Select(dm => dm.MemberId)
            .ToListAsync();

        var available = await _context.Members
            .Where(m => m.LeaveDate == null && !currentMemberIds.Contains(m.MemberId))
            .Select(m => new
            {
                m.MemberId,
                m.FirstName,
                m.LastName,
                m.Email
            })
            .ToListAsync();

        return Ok(available);
    }

    [HttpPost("{id:int}/members")]
    public async Task<IActionResult> AddMember(int id, [FromBody] AddDepartmentMemberDto dto)
    {
        var dept = await _context.Departments.FindAsync(id);
        if (dept == null) return NotFound();

        var member = await _context.Members.FindAsync(dto.MemberId);
        if (member == null) return NotFound();

        var existing = await _context.DepartmentMembers
            .FirstOrDefaultAsync(dm => dm.DepartmentId == id && dm.MemberId == dto.MemberId && dm.LeaveDate == null);
        if (existing != null) return BadRequest("Member already in department.");

        var dm = new DepartmentMember
        {
            DepartmentId = id,
            MemberId = dto.MemberId,
            JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        _context.DepartmentMembers.Add(dm);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            member.MemberId,
            member.FirstName,
            member.LastName,
            member.Email,
            JoinDate = dm.JoinDate,
            LeaveDate = (DateOnly?)null
        });
    }

    [HttpDelete("{id:int}/members/{memberId:int}")]
    public async Task<IActionResult> RemoveMember(int id, int memberId)
    {
        var dm = await _context.DepartmentMembers
            .FirstOrDefaultAsync(dm => dm.DepartmentId == id && dm.MemberId == memberId && dm.LeaveDate == null);
        if (dm == null) return NotFound();

        dm.LeaveDate = DateOnly.FromDateTime(DateTime.UtcNow);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}