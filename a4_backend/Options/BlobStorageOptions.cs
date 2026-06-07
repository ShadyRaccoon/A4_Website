namespace a4_backend.Options;

public class BlobStorageOptions
{
    public string? ConnectionString { get; set; }
    public string? ContainerName { get; set; }
    public string? StorageAccountKey { get; set; }
    public string? StorageAccountName { get; set; }
}