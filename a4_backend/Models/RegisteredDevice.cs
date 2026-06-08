namespace a4_backend.Models;

public class RegisteredDevice
{
    public int RegisteredDeviceId { get; set; }

    public string UserId { get; set; } = null!;
    public UserAccount User { get; set; } = null!;

    public string DeviceIdentifier { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
}