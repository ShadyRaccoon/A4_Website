using a4_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace a4_backend.Configurations;

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