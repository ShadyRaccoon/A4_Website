using a4_backend.DTOs;
using a4_backend.Models;
using a4_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

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

        var roles = await userManager.GetRolesAsync(user);
        var token = tokenService.GenerateToken(user, roles);

        return Ok(new { token });
    }
}