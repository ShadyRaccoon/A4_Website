namespace a4_backend.DTOs;

public record CreatePostDto(
    string Title,
    string Body,
    int? PictureId
);

public record UpdatePostDto(
    string Title,
    string Body,
    int? PictureId
);

public record PostResponseDto(
    int PostId,
    string Title,
    string Body,
    string AuthorId,
    string AuthorName,
    int? PictureId,
    string? PictureUrl,
    bool IsHidden,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);