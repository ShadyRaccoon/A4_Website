namespace A4_Rebuild.Models;

public class RoleAssignment
{
    public int RoleAssignmentId { get; set; }
    public string UserId { get; set; } = null!;
    public string RoleId { get; set; } = null!;
    public int? DepartmentId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }  

    public UserAccount User { get; set; } = null!;
    public Department? Department { get; set; }
}