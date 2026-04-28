using Microsoft.AspNetCore.Identity;

namespace A4_Rebuild.Models;

public class Role : IdentityRole
{
    public string Alias { get; set; } = null!;
    public string? Description { get; set; }
}