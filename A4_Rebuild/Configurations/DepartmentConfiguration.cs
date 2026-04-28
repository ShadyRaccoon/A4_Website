using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using A4_Rebuild.Models;

namespace A4_Rebuild.Configurations;

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Departments");
        builder.HasKey(d => d.DepartmentId);
        
        builder.Property(d => d.Name).HasMaxLength(50).IsRequired();
        builder.Property(d => d.Alias).HasMaxLength(10).IsRequired();
    }
}