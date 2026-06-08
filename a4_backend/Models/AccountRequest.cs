namespace a4_backend.Models;

public class AccountRequest
{
    public int AccountRequestId { get; set; }

    public int RequestedMemberId { get; set; }
    public Member RequestedMember { get; set; } = null!;

    public string AuthorId { get; set; } = null!;
    public UserAccount Author { get; set; } = null!;

    public AccountRequestStatus Status { get; set; } = AccountRequestStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
}

public enum AccountRequestStatus
{
    Pending,
    Accepted,
    Denied
}