namespace a4_backend.DTOs;

public record RegisterDeviceDto(string Token);

public record DeviceResponseDto(
    int RegisteredDeviceId,
    string UserId,
    string UserEmail,
    bool IsActive,
    DateTime RegisteredAt
);