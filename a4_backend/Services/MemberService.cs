using a4_backend.Data;
using a4_backend.DTOs;
using a4_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace a4_backend.Services;

public class MemberService : IMemberService
{
    private readonly AppDbContext _context;

    public MemberService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MemberResponseDto>> GetAllAsync()
    {
        return await _context.Members
            .Select(m => new MemberResponseDto(
                m.MemberId,
                m.FirstName,
                m.LastName,
                m.Faculty,
                m.Email,
                m.PhoneNumber,
                m.JoinDate,
                m.LeaveDate))
            .ToListAsync();
    }

    public async Task<MemberResponseDto?> GetByIdAsync(int id)
    {
        var m = await _context.Members.FindAsync(id);
        if (m == null) return null;
        return new MemberResponseDto(
            m.MemberId, m.FirstName, m.LastName,
            m.Faculty, m.Email, m.PhoneNumber,
            m.JoinDate, m.LeaveDate);
    }

    public async Task<MemberResponseDto> CreateAsync(CreateMemberDto dto)
    {
        var member = new Member
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Faculty = dto.Faculty,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            JoinDate = dto.JoinDate
        };

        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        return new MemberResponseDto(
            member.MemberId, member.FirstName, member.LastName,
            member.Faculty, member.Email, member.PhoneNumber,
            member.JoinDate, member.LeaveDate);
    }

    public async Task<MemberResponseDto?> UpdateAsync(int id, UpdateMemberDto dto)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null) return null;

        member.FirstName = dto.FirstName;
        member.LastName = dto.LastName;
        member.Faculty = dto.Faculty;
        member.Email = dto.Email;
        member.PhoneNumber = dto.PhoneNumber;
        member.LeaveDate = dto.LeaveDate;

        await _context.SaveChangesAsync();

        return new MemberResponseDto(
            member.MemberId, member.FirstName, member.LastName,
            member.Faculty, member.Email, member.PhoneNumber,
            member.JoinDate, member.LeaveDate);
    }

    public async Task<bool> MarkAsLeftAsync(int id)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null) return false;

        member.LeaveDate = DateOnly.FromDateTime(DateTime.UtcNow);
        await _context.SaveChangesAsync();
        return true;
    }
}