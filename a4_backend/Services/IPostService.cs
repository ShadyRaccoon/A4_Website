using a4_backend.DTOs;

namespace a4_backend.Services;

public interface IPostService
{
    Task<List<PostResponseDto>> GetAllAsync(bool includeHidden = false);
    Task<PostResponseDto?> GetByIdAsync(int id);
    Task<PostResponseDto> CreateAsync(CreatePostDto dto, string authorId);
    Task<PostResponseDto?> UpdateAsync(int id, UpdatePostDto dto, string authorId);
    Task<bool> ToggleHiddenAsync(int id);
    Task<bool> DeleteAsync(int id);
}