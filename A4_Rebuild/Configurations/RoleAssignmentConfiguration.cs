using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using A4_Rebuild.Models;

namespace A4_Rebuild.Configurations;

public class RoleAssignmentConfiguration : IEntityTypeConfiguration<RoleAssignment>
{
    public void Configure(EntityTypeBuilder<RoleAssignment> builder)
    {
        builder.ToTable("RoleAssignments");

        builder.HasKey(ra => ra.RoleAssignmentId);
        
        builder.Property(ra => ra.StartDate).IsRequired();

        builder.HasOne(ra => ra.User)
            .WithMany()
            .HasForeignKey(ra => ra.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(ra => ra.Department)
            .WithMany()
            .HasForeignKey(ra => ra.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}