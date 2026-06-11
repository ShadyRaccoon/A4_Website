using a4_backend.DTOs;
using a4_backend.Models;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController (UserManager<UserAccount> userManager, TokenService tokenService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user is null || !await userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized("Invalid credentials.");

        if (!user.IsActive)
            return Unauthorized("Account is deactivated.");

        var roles = await userManager.GetRolesAsync(user);
        var token = tokenService.GenerateToken(user, roles);

        return Ok(new { token });
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var user = new UserAccount
        {
            UserName = dto.UserName,
            Email = dto.Email
        };

        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await userManager.AddToRoleAsync(user, "Member");

        var roles = await userManager.GetRolesAsync(user);
        var token = tokenService.GenerateToken(user, roles);

        return Ok(new { token });
    }
    
    [HttpGet("accounts")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAccounts()
    {
        var users = await userManager.Users
            .Include(u => u.Member)
            .ToListAsync();

        var result = new List<object>();
        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            result.Add(new
            {
                user.Id,
                user.Email,
                user.UserName,
                user.IsActive,
                user.CreatedAt,
                MemberName = user.Member != null ? user.Member.FirstName + " " + user.Member.LastName : null,
                Role = roles.FirstOrDefault() ?? "None"
            });
        }

        return Ok(result);
    }

    [HttpPatch("{id}/toggle-active")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleActive(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        user.IsActive = !user.IsActive;
        user.TerminatedAt = user.IsActive ? null : DateTime.UtcNow;

        await userManager.UpdateAsync(user);
        return NoContent();
    }
}