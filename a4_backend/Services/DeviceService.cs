using a4_backend.Data;
using a4_backend.Models;
using a4_backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace a4_backend.Services;

public class DeviceService : IDeviceService
{
    private readonly AppDbContext _context;

    public DeviceService(AppDbContext context)
    {
        _context = context;
    }

    private static string Hash(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLower();
    }

    public async Task<bool> RegisterAsync(string token, string userId, string deviceIdentifier)
    {
        var deviceToken = await _context.DeviceTokens
            .FirstOrDefaultAsync(t => t.Token == token
                                   && !t.IsUsed
                                   && t.ExpiresAt > DateTime.UtcNow);

        if (deviceToken == null) return false;

        deviceToken.IsUsed = true;

        var device = new RegisteredDevice
        {
            UserId = userId,
            DeviceIdentifier = Hash(deviceIdentifier),
            IsActive = true,
            RegisteredAt = DateTime.UtcNow
        };

        _context.RegisteredDevices.Add(device);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsDeviceRegisteredAsync(string deviceIdentifier)
    {
        var hashed = Hash(deviceIdentifier);
        return await _context.RegisteredDevices
            .AnyAsync(d => d.DeviceIdentifier == hashed && d.IsActive);
    }

    public async Task<List<DeviceResponseDto>> GetAllAsync()
    {
        return await _context.RegisteredDevices
            .Include(d => d.User)
            .OrderByDescending(d => d.RegisteredAt)
            .Select(d => new DeviceResponseDto(
                d.RegisteredDeviceId,
                d.UserId,
                d.User.Email!,
                d.IsActive,
                d.RegisteredAt))
            .ToListAsync();
    }

    public async Task<bool> DeactivateAsync(int id)
    {
        var device = await _context.RegisteredDevices.FindAsync(id);
        if (device == null) return false;

        device.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}