using Microsoft.Extensions.Options;
using a4_backend.Options;
using Azure.Storage;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;

namespace a4_backend.Services;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobStorageOptions _blobStorage;
    private readonly BlobContainerClient _blobContainerClient;

    public BlobStorageService(IOptions<BlobStorageOptions> blobStorage)
    {
        _blobStorage = blobStorage.Value;
        _blobContainerClient = new BlobContainerClient(
            _blobStorage.ConnectionString, 
            _blobStorage.ContainerName);
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        await _blobContainerClient.CreateIfNotExistsAsync();
        await _blobContainerClient.SetAccessPolicyAsync(
            Azure.Storage.Blobs.Models.PublicAccessType.None);
        
        var blobName = $"{Guid.NewGuid()}_{file.FileName}";
        BlobClient blobClient = _blobContainerClient.GetBlobClient(blobName);

        await using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(stream, true);
        
        return blobClient.Uri.ToString();
    }

    public async Task<FileContentResult> DownloadFileAsync(string url)
    {
        Uri blobUri = new(url);
        StorageSharedKeyCredential credentials = new(
            _blobStorage.StorageAccountName,
            _blobStorage.StorageAccountKey);

        BlobClient blobClient = new(blobUri, credentials);
        
        var downloadResponse = await blobClient.DownloadStreamingAsync();

        using MemoryStream memoryStream = new();
        await downloadResponse.Value.Content.CopyToAsync(memoryStream);
        memoryStream.Position = 0;
        
        return new FileContentResult(
            memoryStream.ToArray(), 
            downloadResponse.Value.Details.ContentType)
        {
            FileDownloadName = blobUri.Segments.Last()
        };
    }
    
    public async Task DeleteFileAsync(string url)
    {
        Uri blobUri = new(url);
        StorageSharedKeyCredential credentials = new(
            _blobStorage.StorageAccountName,
            _blobStorage.StorageAccountKey);

        BlobClient blobClient = new(blobUri, credentials);
        await blobClient.DeleteIfExistsAsync();
    }
}