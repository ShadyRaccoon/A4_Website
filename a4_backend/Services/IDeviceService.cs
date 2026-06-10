using a4_backend.DTOs;

namespace a4_backend.Services;

public interface IDeviceService
{
    Task<bool> RegisterAsync(string token, string userId, string deviceIdentifier);
    Task<bool> IsDeviceRegisteredAsync(string deviceIdentifier);
    Task<List<DeviceResponseDto>> GetAllAsync();
    Task<bool> DeactivateAsync(int id);
}