namespace a4_backend.DTOs;

public record CreateAccountRequestDto(int RequestedMemberId);

public record AccountRequestResponseDto(
    int AccountRequestId,
    int RequestedMemberId,
    string RequestedMemberName,
    string AuthorId,
    string AuthorEmail,
    string Status,
    DateTime CreatedAt,
    DateTime? ResolvedAt
);