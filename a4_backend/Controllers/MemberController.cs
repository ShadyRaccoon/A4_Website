using a4_backend.Data;
using a4_backend.DTOs;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using a4_backend.Models;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MemberController : ControllerBase
{
    private readonly IMemberService _memberService;
    private readonly AppDbContext _context;

    public MemberController(IMemberService memberService, AppDbContext context)
    {
        _memberService = memberService;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var members = await _memberService.GetAllAsync();
        return Ok(members);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var member = await _memberService.GetByIdAsync(id);
        if (member == null) return NotFound();
        return Ok(member);
    }

    [HttpPost]
    [Authorize(Roles = "Bureau,Admin")]
    public async Task<IActionResult> Create(CreateMemberDto dto)
    {
        var member = await _memberService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = member.MemberId }, member);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Bureau,Admin")]
    public async Task<IActionResult> Update(int id, UpdateMemberDto dto)
    {
        var member = await _memberService.UpdateAsync(id, dto);
        if (member == null) return NotFound();
        return Ok(member);
    }

    [HttpPatch("{id:int}/mark-left")]
    [Authorize(Roles = "Bureau,Admin")]
    public async Task<IActionResult> MarkAsLeft(int id)
    {
        var result = await _memberService.MarkAsLeftAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
    
    [HttpGet("eligible-for-account")]
    [Authorize(Roles = "Bureau,Admin")]
    [HttpGet("eligible-for-account")]
    [Authorize(Roles = "Bureau,Admin,Member")]
    public async Task<IActionResult> GetEligibleForAccount()
    {
        var membersWithPendingRequests = await _context.AccountRequests
            .Where(r => r.Status == AccountRequestStatus.Pending)
            .Select(r => r.RequestedMemberId)
            .ToListAsync();

        var members = await _context.Members
            .Include(m => m.UserAccount)
            .Where(m => m.LeaveDate == null
                        && (m.UserAccount == null || !m.UserAccount.IsActive)
                        && !membersWithPendingRequests.Contains(m.MemberId))
            .Select(m => new { m.MemberId, m.FirstName, m.LastName, m.Email })
            .ToListAsync();

        return Ok(members);
    }
}