using Microsoft.AspNetCore.Identity;
using A4_Rebuild.Models;
using A4_Rebuild.Data;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using Microsoft.EntityFrameworkCore;

namespace A4_Rebuild.Data.DataSeeders;

public class UserSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext, UserManager<UserAccount> userManager, RoleManager<Role> roleManager)
    {
        if (dbContext.Roles.Any()) return;

        (string, string)[] roles = [
            ("Admin", "Admin"),
            ("Presedinte", "P"), 
            ("Vicepresedinte", "VP"),
            ("Secretar General", "SG"),
            ("Coordonator Resurse Umane", "HR"),
            ("Coordonator Relatii Publice", "PR"),
            ("Coordonator Imagine", "IMG"),
            ("Coordonator Fundraising", "FR"),
            ("Coordonator Reprezentare", "REPRE"),
            ("Coordonator Socio-Cultural", "SOCIO"),
            ("Cenzor ", "Cenzor"),
            
        ];

        foreach (var (name, alias) in roles)
        {
            if (!await roleManager.RoleExistsAsync(name))
                await roleManager.CreateAsync(new Role
                {
                    Name = name,
                    Alias = alias
                });
        }

        var members = await dbContext.Members.ToListAsync();
        
        var userSeedData = new (int MemberId, string IdentityRole)[]
        {
            (10, "Admin"),
            (1, "Presedinte"),
            (2, "Vicepresedinte"),
            (3, "Secretar General"),
            (4, "Cenzor"),
            (5, "Coordonator Resurse Umane"),
            (6, "Coordonator Relatii Publice"),
            (7, "Coordonator Imagine"),
            (8, "Coordonator Fundraising"),
            (9, "Coordonator Reprezentare"),
            (11, "Coordonator Socio-Cultural"),
        };

        foreach (var (MemberId, role) in userSeedData)
        {
            //check if the member has mapping in the Dictionary holding id's and roles of members with accounts
            //  if not - skip them, no account for them
            var member = members.FirstOrDefault(x => x.MemberId == MemberId);
            if (member == null) continue;
            
            //check if the user is already registered with an account by email
            if (await userManager.FindByEmailAsync(member.Email) != null) continue;

            var user = new UserAccount
            {
                UserName = $"{member.FirstName}{member.LastName}{member.PhoneNumber[^3..]}",
                Email = member.Email,
                MemberId = member.MemberId,
                IsActive = true,
                EmailConfirmed = true
            };

            var password = $"{member.FirstName}{member.LastName}1!";
            var result = await userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, role);
            }
        }
    }
}