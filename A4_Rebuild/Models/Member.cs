namespace A4_Rebuild.Models;

public class Member
{
    public int MemberId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Faculty { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public DateOnly JoinDate { get; set; }
    public DateOnly? LeaveDate { get; set; }

    public UserAccount? UserAccount { get; set; }
    public ICollection<DepartmentMember> DepartmentMembers { get; set; } = new List<DepartmentMember>();
}