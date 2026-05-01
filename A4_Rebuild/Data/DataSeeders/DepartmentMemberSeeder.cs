using A4_Rebuild.Models;
using CsvHelper.Configuration;
using CsvHelper;
using System.Globalization;

namespace A4_Rebuild.Data.DataSeeders;

public class DepartmentMemberSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (dbContext.DepartmentMembers.Any()) return;

        var csvPath = Path.Combine(AppContext.BaseDirectory, "SeedingData", "departmentMember.csv");

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
        };
        
        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, config);
        
        var departmentMembers = csv.GetRecords<DepartmentMemberCsvRecord>()
            .Select(
                dm => new DepartmentMember
                {
                    DepartmentId = dm.DepartmentId,
                    MemberId = dm.MemberId,
                    JoinDate = DateOnly.Parse(dm.JoinDate),
                    LeaveDate = string.IsNullOrWhiteSpace(dm.LeaveDate) ? null : DateOnly.Parse(dm.LeaveDate)
                })
            .ToList();
        
        await dbContext.DepartmentMembers.AddRangeAsync(departmentMembers);
        await dbContext.SaveChangesAsync();
    }

    private record DepartmentMemberCsvRecord(
        int MemberId,
        int DepartmentId,
        string JoinDate,
        string LeaveDate
    );
}