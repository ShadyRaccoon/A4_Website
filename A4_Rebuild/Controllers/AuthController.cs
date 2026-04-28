using A4_Rebuild.Models;
using A4_Rebuild.Services;
using A4_Rebuild.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace A4_Rebuild.Controllers;

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