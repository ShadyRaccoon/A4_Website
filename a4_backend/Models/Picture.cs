namespace a4_backend.Models;

public class Picture
{
    public int PictureId { get; set; }
    public string Url { get; set; } = null!;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}