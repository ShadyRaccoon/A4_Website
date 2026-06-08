namespace a4_backend.Models;

public class Post
{
    public int PostId { get; set; }

    public string AuthorId { get; set; } = null!;
    public UserAccount Author { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string Body { get; set; } = null!;

    public int? PictureId { get; set; }
    public Picture? Picture { get; set; }

    public bool IsHidden { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}