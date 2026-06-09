using Microsoft.AspNetCore.Identity;

namespace a4_backend.Models;

public class UserAccount : IdentityUser
{
    public int? MemberId { get; set; }
    public Member? Member { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? TerminatedAt { get; set; }
}