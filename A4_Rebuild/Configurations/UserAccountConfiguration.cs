using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using A4_Rebuild.Models;

namespace A4_Rebuild.Configurations;

public class UserAccountConfiguration : IEntityTypeConfiguration<UserAccount>
{
    public void Configure(EntityTypeBuilder<UserAccount> builder)
    {
        builder.ToTable("Users");
        
        builder.Ignore(u => u.PhoneNumberConfirmed);
        builder.Ignore(u => u.TwoFactorEnabled);
        
        builder.Property(u => u.Email).HasMaxLength(128);
        builder.Property(u => u.UserName).HasMaxLength(64);
        
        builder.HasOne(u => u.Member)
            .WithOne(m => m.UserAccount)
            .HasForeignKey<UserAccount>(u => u.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}