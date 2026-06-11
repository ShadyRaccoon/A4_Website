using a4_backend.Data;
using a4_backend.DTOs;
using a4_backend.Models;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    UserManager<UserAccount> userManager,
    TokenService tokenService,
    AppDbContext context,
    IEmailSenderService emailService) : ControllerBase
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

    [HttpPost("create-account")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var existing = await userManager.FindByEmailAsync(dto.Email);
        if (existing != null && existing.IsActive)
            return BadRequest("An active account with this email already exists.");

        var tempPassword = Guid.NewGuid().ToString("N")[..12] + "A1!";

        var member = await context.Members
            .Include(m => m.UserAccount)
            .FirstOrDefaultAsync(m => m.Email == dto.Email);

        var memberId = (member != null && member.UserAccount == null) ? member.MemberId : (int?)null;

        var user = new UserAccount
        {
            UserName = dto.Email.Split('@')[0],
            Email = dto.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            MemberId = memberId
        };

        var result = await userManager.CreateAsync(user, tempPassword);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await userManager.AddToRoleAsync(user, dto.Role ?? "Member");

        var tokenMemberId = memberId ?? context.Members.First().MemberId;

        var token = Guid.NewGuid().ToString();
        context.DeviceTokens.Add(new DeviceToken
        {
            MemberId = tokenMemberId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsUsed = false
        });
        await context.SaveChangesAsync();

        await emailService.SendEmailAsync(
            dto.Email,
            "Contul tău A4 a fost creat",
            $"""
            Salut,

            Un cont a fost creat pentru tine pe platforma A4.

            Email: {dto.Email}
            Parolă temporară: {tempPassword}

            Înregistrează-ți dispozitivul accesând linkul:
            http://localhost:5173/register-device?token={token}

            Linkul expiră în 7 zile.

            - Echipa A4
            """
        );

        return Ok("Account created and email sent.");
    }

    [HttpPost("{id}/send-device-token")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SendDeviceToken(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        var memberId = user.MemberId ?? context.Members.First().MemberId;

        var token = Guid.NewGuid().ToString();
        context.DeviceTokens.Add(new DeviceToken
        {
            MemberId = memberId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsUsed = false
        });
        await context.SaveChangesAsync();

        await emailService.SendEmailAsync(
            user.Email!,
            "Înregistrează-ți dispozitivul — A4",
            $"""
            Salut,

            Accesează linkul de mai jos pentru a-ți înregistra un dispozitiv nou:

            http://localhost:5173/register-device?token={token}

            Linkul expiră în 7 zile.

            - Echipa A4
            """
        );

        return Ok("Device token sent.");
    }
    
    [HttpPost("device-token")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SendDeviceTokenByEmail([FromBody] SendDeviceTokenByEmailDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user == null) return NotFound("No account found with that email.");
        if (!user.IsActive) return BadRequest("Account is deactivated.");

        var memberId = user.MemberId ?? context.Members.First().MemberId;

        var token = Guid.NewGuid().ToString();
        context.DeviceTokens.Add(new DeviceToken
        {
            MemberId = memberId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsUsed = false
        });
        await context.SaveChangesAsync();

        await emailService.SendEmailAsync(
            dto.Email,
            "Înregistrează-ți dispozitivul — A4",
            $"""
             Salut,

             Accesează linkul de mai jos pentru a-ți înregistra un dispozitiv nou:

             http://localhost:5173/register-device?token={token}

             Linkul expiră în 7 zile.

             - Echipa A4
             """
        );

        return Ok("Token trimis.");
    }
}