using a4_backend.DTOs;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountRequestController : ControllerBase
{
    private readonly IAccountRequestService _accountRequestService;

    public AccountRequestController(IAccountRequestService accountRequestService)
    {
        _accountRequestService = accountRequestService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _accountRequestService.GetAllAsync();
        return Ok(requests);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _accountRequestService.GetByIdAsync(id);
        if (request == null) return NotFound();
        return Ok(request);
    }

    [HttpPost]
    [Authorize(Roles = "Member,Bureau,Admin")]
    public async Task<IActionResult> Create(CreateAccountRequestDto dto)
    {
        try
        {
            var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var request = await _accountRequestService.CreateAsync(dto, authorId);
            return CreatedAtAction(nameof(GetById), new { id = request.AccountRequestId }, request);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpPatch("{id:int}/accept")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Accept(int id)
    {
        var result = await _accountRequestService.AcceptAsync(id);
        if (!result) return BadRequest("Request not found or already resolved.");
        return NoContent();
    }

    [HttpPatch("{id:int}/deny")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deny(int id)
    {
        var result = await _accountRequestService.DenyAsync(id);
        if (!result) return BadRequest("Request not found or already resolved.");
        return NoContent();
    }
}