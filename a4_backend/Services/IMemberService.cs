using a4_backend.DTOs;

namespace a4_backend.Services;

public interface IMemberService
{
    Task<List<MemberResponseDto>> GetAllAsync();
    Task<MemberResponseDto?> GetByIdAsync(int id);
    Task<MemberResponseDto> CreateAsync(CreateMemberDto dto);
    Task<MemberResponseDto?> UpdateAsync(int id, UpdateMemberDto dto);
    Task<bool> MarkAsLeftAsync(int id);
}