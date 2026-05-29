using a4_backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace a4_backend.Configurations;

public class DepartmentMemberConfiguration : IEntityTypeConfiguration<DepartmentMember>
{
    public void Configure(EntityTypeBuilder<DepartmentMember> builder)
    {
        builder.ToTable("DepartmentMembers");
        builder.HasKey(dm => dm.DepartmentMemberId);
        
        builder.Property(dm => dm.JoinDate).IsRequired();
        
        builder.HasOne(dm => dm.Member)
            .WithMany(m => m.DepartmentMembers)
            .HasForeignKey(dm => dm.MemberId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(dm => dm.Department)
            .WithMany(d => d.DepartmentMembers)
            .HasForeignKey(dm => dm.DepartmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}