namespace a4_backend.DTOs;

public record RegisterDeviceDto(string Token, string DeviceIdentifier);

public record DeviceResponseDto(
    int RegisteredDeviceId,
    string UserId,
    string UserEmail,
    bool IsActive,
    DateTime RegisteredAt
);