namespace a4_backend.Models;

public class DeviceToken
{
    public int DeviceTokenId { get; set; }

    public int MemberId { get; set; }
    public Member Member { get; set; } = null!;

    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}