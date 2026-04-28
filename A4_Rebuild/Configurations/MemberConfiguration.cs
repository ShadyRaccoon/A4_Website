using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using A4_Rebuild.Models;

namespace A4_Rebuild.Configurations;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.ToTable("Members");
        builder.HasKey(m => m.MemberId);
        
        builder.Property(m => m.FirstName).HasMaxLength(50).IsRequired();
        builder.Property(m => m.LastName).HasMaxLength(50).IsRequired();
        builder.Property(m => m.Faculty).HasMaxLength(100).IsRequired();
        builder.Property(m => m.JoinDate).IsRequired();
    }
}