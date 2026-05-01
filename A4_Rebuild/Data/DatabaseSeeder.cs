using A4_Rebuild.Data.DataSeeders;
using A4_Rebuild.Models;
using Microsoft.AspNetCore.Identity;

namespace A4_Rebuild.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(
        AppDbContext context,
        UserManager<UserAccount> userManager,
        RoleManager<Role> roleManager)
    {
        await MemberSeeder.SeedAsync(context);
        await DepartmentSeeder.SeedAsync(context);
        await DepartmentMemberSeeder.SeedAsync(context);
        await UserSeeder.SeedAsync(context, userManager, roleManager);
    }
}