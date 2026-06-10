using a4_backend.Data;
using a4_backend.DTOs;
using a4_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace a4_backend.Services;

public class PostService : IPostService
{
    private readonly AppDbContext _context;
    private readonly IBlobStorageService _blobStorageService;

    public PostService(AppDbContext context, IBlobStorageService blobStorageService)
    {
        _context = context;
        _blobStorageService = blobStorageService;
    }

    public async Task<List<PostResponseDto>> GetAllAsync(bool includeHidden = false)
    {
        var query = _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Picture)
            .AsQueryable();

        if (!includeHidden)
            query = query.Where(p => !p.IsHidden);

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostResponseDto(
                p.PostId,
                p.Title,
                p.Body,
                p.AuthorId,
                p.Author.UserName!,
                p.PictureId,
                p.Picture != null ? p.Picture.Url : null,
                p.IsHidden,
                p.CreatedAt,
                p.UpdatedAt))
            .ToListAsync();
    }

    public async Task<PostResponseDto?> GetByIdAsync(int id)
    {
        var p = await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Picture)
            .FirstOrDefaultAsync(p => p.PostId == id);

        if (p == null) return null;

        return new PostResponseDto(
            p.PostId, p.Title, p.Body,
            p.AuthorId, p.Author.UserName!,
            p.PictureId,
            p.Picture?.Url,
            p.IsHidden, p.CreatedAt, p.UpdatedAt);
    }

    public async Task<PostResponseDto> CreateAsync(CreatePostDto dto, string authorId)
    {
        var post = new Post
        {
            Title = dto.Title,
            Body = dto.Body,
            PictureId = dto.PictureId,
            AuthorId = authorId
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(post.PostId) ?? throw new Exception("Post not found after creation");
    }

    public async Task<PostResponseDto?> UpdateAsync(int id, UpdatePostDto dto, string authorId)
    {
        var post = await _context.Posts
            .Include(p => p.Picture)
            .FirstOrDefaultAsync(p => p.PostId == id);
        if (post == null) return null;

        if (post.Picture != null && dto.PictureId != post.PictureId)
        {
            await _blobStorageService.DeleteFileAsync(post.Picture.Url);
            _context.Pictures.Remove(post.Picture);
        }

        post.Title = dto.Title;
        post.Body = dto.Body;
        post.PictureId = dto.PictureId;
        post.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> ToggleHiddenAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return false;

        post.IsHidden = !post.IsHidden;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var post = await _context.Posts
            .Include(p => p.Picture)
            .FirstOrDefaultAsync(p => p.PostId == id);
        if (post == null) return false;

        if (post.Picture != null)
        {
            await _blobStorageService.DeleteFileAsync(post.Picture.Url);
            _context.Pictures.Remove(post.Picture);
        }

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }
}