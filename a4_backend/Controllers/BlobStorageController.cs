using a4_backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlobStorageController : ControllerBase
{
    private readonly IBlobStorageService _blobStorageService;

    public BlobStorageController(IBlobStorageService blobStorageService)
    {
        _blobStorageService = blobStorageService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        var url = await _blobStorageService.UploadFileAsync(file);
        return Ok(url);
    }

    [HttpGet("download")]
    public async Task<IActionResult> Download([FromQuery] string url)
    {
        var result = await _blobStorageService.DownloadFileAsync(url);
        return result;
    }
}