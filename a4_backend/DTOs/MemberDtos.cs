namespace a4_backend.DTOs;

public record CreateMemberDto(
    string FirstName,
    string LastName,
    string Faculty,
    string Email,
    string PhoneNumber,
    DateOnly JoinDate
);

public record UpdateMemberDto(
    string FirstName,
    string LastName,
    string Faculty,
    string Email,
    string PhoneNumber,
    DateOnly? LeaveDate
);

public record MemberResponseDto(
    int MemberId,
    string FirstName,
    string LastName,
    string Faculty,
    string Email,
    string PhoneNumber,
    DateOnly JoinDate,
    DateOnly? LeaveDate
);