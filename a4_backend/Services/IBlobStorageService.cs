using Microsoft.AspNetCore.Mvc;

namespace a4_backend.Services;

public interface IBlobStorageService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task<FileContentResult> DownloadFileAsync(string url);
}