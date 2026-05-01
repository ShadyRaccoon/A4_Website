using A4_Rebuild.Models;
using CsvHelper.Configuration;
using CsvHelper;
using CsvHelper.Configuration.Attributes;
using System.Globalization;

namespace A4_Rebuild.Data.DataSeeders;

public class DepartmentSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (dbContext.Departments.Any()) return;

        var csvPath = Path.Combine(AppContext.BaseDirectory, "SeedingData", "departments.csv");

        var config = new CsvConfiguration(CultureInfo.InvariantCulture){
            HasHeaderRecord = true
        };

        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader,config);
        
        var members = csv.GetRecords<DepartmentCsvRecord>().ToList()
            .Select(r => new Department
            {
                DepartmentId =  r.DepartmentId,
                Name = r.Name,
                Alias = r.Alias
            })
            .ToList();
        
        await dbContext.Departments.AddRangeAsync(members);
        await dbContext.SaveChangesAsync();
    }

    private record DepartmentCsvRecord
    (
        int DepartmentId,
        string Name,
        string Alias
    );
}