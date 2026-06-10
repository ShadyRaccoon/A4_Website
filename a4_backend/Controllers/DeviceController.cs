using a4_backend.DTOs;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeviceController : ControllerBase
{
    private readonly IDeviceService _deviceService;

    public DeviceController(IDeviceService deviceService)
    {
        _deviceService = deviceService;
    }

    [HttpPost("register")]
    [Authorize]
    public async Task<IActionResult> Register([FromBody] RegisterDeviceDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var deviceIdentifier = Request.Cookies["DeviceId"];

        if (string.IsNullOrEmpty(deviceIdentifier))
        {
            deviceIdentifier = Guid.NewGuid().ToString();
            Response.Cookies.Append("DeviceId", deviceIdentifier, new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTimeOffset.UtcNow.AddYears(1),
                SameSite = SameSiteMode.Strict
            });
        }

        var result = await _deviceService.RegisterAsync(dto.Token, userId, deviceIdentifier);
        if (!result) return BadRequest("Invalid or expired token.");

        return Ok("Device registered successfully.");
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var devices = await _deviceService.GetAllAsync();
        return Ok(devices);
    }

    [HttpPatch("{id:int}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var result = await _deviceService.DeactivateAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}