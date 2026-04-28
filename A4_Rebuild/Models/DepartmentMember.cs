namespace A4_Rebuild.Models;

public class DepartmentMember
{
    public int DepartmentMemberId { get; set; }  
    public int MemberId { get; set; }
    public int DepartmentId { get; set; }
    public DateOnly JoinDate { get; set; }
    public DateOnly? LeaveDate { get; set; }

    public Member Member { get; set; } = null!;
    public Department Department { get; set; } = null!;
}