using a4_backend.Data.DataSeeders;
using a4_backend.Models;
using Microsoft.AspNetCore.Identity;

namespace a4_backend.Data;

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