using a4_backend.DTOs;

namespace a4_backend.Services;

public interface IAccountRequestService
{
    Task<List<AccountRequestResponseDto>> GetAllAsync();
    Task<AccountRequestResponseDto?> GetByIdAsync(int id);
    Task<AccountRequestResponseDto> CreateAsync(CreateAccountRequestDto dto, string authorId);
    Task<bool> AcceptAsync(int id);
    Task<bool> DenyAsync(int id);
}