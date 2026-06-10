using a4_backend.Data;
using a4_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PictureController : ControllerBase
{
    private readonly AppDbContext _context;

    public PictureController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePictureDto dto)
    {
        var picture = new Picture { Url = dto.Url };
        _context.Pictures.Add(picture);
        await _context.SaveChangesAsync();
        return Ok(new { picture.PictureId, picture.Url });
    }
}

public record CreatePictureDto(string Url);