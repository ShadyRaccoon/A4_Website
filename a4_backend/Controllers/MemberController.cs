using a4_backend.DTOs;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MemberController : ControllerBase
{
    private readonly IMemberService _memberService;

    public MemberController(IMemberService memberService)
    {
        _memberService = memberService;
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
}