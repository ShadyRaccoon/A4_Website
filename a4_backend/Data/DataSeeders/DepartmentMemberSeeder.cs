using CsvHelper.Configuration;
using CsvHelper;
using System.Globalization;
using a4_backend.Models;

namespace a4_backend.Data.DataSeeders;

public class DepartmentMemberSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (dbContext.DepartmentMembers.Any()) return;

        var csvPath = Path.Combine(AppContext.BaseDirectory, "Data", "SeedingData", "departmentMembers.csv");

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