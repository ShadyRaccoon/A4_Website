using A4_Rebuild.Models;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;

namespace A4_Rebuild.Data.DataSeeders;

public class MemberSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (dbContext.Members.Any()) return;
        
        var csvPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "members.csv");

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true
        };
        
        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, config);

        var members = csv.GetRecords<MembersCsvRecord>()
            .Select(
                r => new Member
                {
                    MemberId = r.MemberId,
                    FirstName = r.FirstName,
                    LastName = r.LastName,
                    Faculty = r.Faculty,
                    JoinDate = DateOnly.Parse(r.JoinDate),
                    LeaveDate = string.IsNullOrWhiteSpace(r.LeaveDate) ? null : DateOnly.Parse(r.LeaveDate),
                    Email = r.Email,
                    PhoneNumber =  r.PhoneNumber
                }
            )
            .ToList();
        
        await dbContext.Members.AddRangeAsync(members);
        await dbContext.SaveChangesAsync();
    }

    private record MembersCsvRecord
    (
        int MemberId,
        string FirstName,
        string LastName,
        string Faculty,
        string JoinDate,
        string LeaveDate,
        string Email,
        string PhoneNumber
    );
}