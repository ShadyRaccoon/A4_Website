namespace A4_Rebuild.Models;

public class Department
{
    public int DepartmentId { get; set; }
    public string Name { get; set; } = null!;
    public string Alias { get; set; } = null!;

    public ICollection<DepartmentMember> DepartmentMembers { get; set; } = new List<DepartmentMember>();
}