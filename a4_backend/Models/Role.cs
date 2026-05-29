using Microsoft.AspNetCore.Identity;

namespace a4_backend.Models;

public class Role : IdentityRole
{
    public string Alias { get; set; } = null!;
    public string? Description { get; set; }
}