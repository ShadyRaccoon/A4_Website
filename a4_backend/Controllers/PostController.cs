using a4_backend.DTOs;
using a4_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace a4_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly IPostService _postService;

    public PostController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var posts = await _postService.GetAllAsync(includeHidden: false);
        return Ok(posts);
    }

    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAllIncludingHidden()
    {
        var posts = await _postService.GetAllAsync(includeHidden: true);
        return Ok(posts);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _postService.GetByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    [Authorize(Roles = "Member,Bureau,Admin")]
    public async Task<IActionResult> Create(CreatePostDto dto)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var post = await _postService.CreateAsync(dto, authorId);
        return CreatedAtAction(nameof(GetById), new { id = post.PostId }, post);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Member,Bureau,Admin")]
    public async Task<IActionResult> Update(int id, UpdatePostDto dto)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var post = await _postService.UpdateAsync(id, dto, authorId);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpPatch("{id:int}/toggle-hidden")]
    [Authorize(Roles = "Member,Bureau,Admin")]
    public async Task<IActionResult> ToggleHidden(int id)
    {
        var result = await _postService.ToggleHiddenAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Member,Bureau,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _postService.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}