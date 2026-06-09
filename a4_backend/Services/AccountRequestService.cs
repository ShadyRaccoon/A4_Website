using a4_backend.Data;
using a4_backend.DTOs;
using a4_backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace a4_backend.Services;

public class AccountRequestService : IAccountRequestService
{
    private readonly AppDbContext _context;
    private readonly UserManager<UserAccount> _userManager;
    private readonly IEmailSenderService _emailService;

    public AccountRequestService(
        AppDbContext context,
        UserManager<UserAccount> userManager,
        IEmailSenderService emailService)
    {
        _context = context;
        _userManager = userManager;
        _emailService = emailService;
    }

    public async Task<List<AccountRequestResponseDto>> GetAllAsync()
    {
        return await _context.AccountRequests
            .Include(r => r.RequestedMember)
            .Include(r => r.Author)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new AccountRequestResponseDto(
                r.AccountRequestId,
                r.RequestedMemberId,
                r.RequestedMember.FirstName + " " + r.RequestedMember.LastName,
                r.AuthorId,
                r.Author.Email!,
                r.Status.ToString(),
                r.CreatedAt,
                r.ResolvedAt))
            .ToListAsync();
    }

    public async Task<AccountRequestResponseDto?> GetByIdAsync(int id)
    {
        var r = await _context.AccountRequests
            .Include(r => r.RequestedMember)
            .Include(r => r.Author)
            .FirstOrDefaultAsync(r => r.AccountRequestId == id);

        if (r == null) return null;

        return new AccountRequestResponseDto(
            r.AccountRequestId,
            r.RequestedMemberId,
            r.RequestedMember.FirstName + " " + r.RequestedMember.LastName,
            r.AuthorId,
            r.Author.Email!,
            r.Status.ToString(),
            r.CreatedAt,
            r.ResolvedAt);
    }

    public async Task<AccountRequestResponseDto> CreateAsync(CreateAccountRequestDto dto, string authorId)
    {
        var request = new AccountRequest
        {
            RequestedMemberId = dto.RequestedMemberId,
            AuthorId = authorId,
            Status = AccountRequestStatus.Pending
        };

        _context.AccountRequests.Add(request);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(request.AccountRequestId)
            ?? throw new Exception("Request not found after creation");
    }

    public async Task<bool> AcceptAsync(int id)
    {
        var request = await _context.AccountRequests
            .Include(r => r.RequestedMember)
            .Include(r => r.Author)
            .FirstOrDefaultAsync(r => r.AccountRequestId == id);

        if (request == null || request.Status != AccountRequestStatus.Pending)
            return false;

        // accept this request
        request.Status = AccountRequestStatus.Accepted;
        request.ResolvedAt = DateTime.UtcNow;

        // link member to user account
        var user = await _userManager.FindByIdAsync(request.AuthorId);
        if (user != null)
        {
            user.MemberId = request.RequestedMemberId;
            await _userManager.UpdateAsync(user);
        }

        // auto-deny all other pending requests for the same member
        var otherRequests = await _context.AccountRequests
            .Where(r => r.RequestedMemberId == request.RequestedMemberId
                     && r.AccountRequestId != id
                     && r.Status == AccountRequestStatus.Pending)
            .ToListAsync();

        foreach (var other in otherRequests)
        {
            other.Status = AccountRequestStatus.Denied;
            other.ResolvedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        // generate device token and send email
        var token = Guid.NewGuid().ToString();
        var deviceToken = new DeviceToken
        {
            MemberId = request.RequestedMemberId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsUsed = false
        };

        _context.DeviceTokens.Add(deviceToken);
        await _context.SaveChangesAsync();

        await _emailService.SendEmailAsync(
            request.Author.Email!,
            "Cererea ta a fost acceptată — Înregistrează-ți dispozitivul",
            $"""
            Salut,

            Cererea ta de asociere cu membrul {request.RequestedMember.FirstName} {request.RequestedMember.LastName} a fost acceptată.

            Folosește tokenul de mai jos pentru a-ți înregistra dispozitivul:

            {token}

            Tokenul expiră în 7 zile.

            - Echipa A4
            """
        );

        return true;
    }

    public async Task<bool> DenyAsync(int id)
    {
        var request = await _context.AccountRequests
            .FirstOrDefaultAsync(r => r.AccountRequestId == id);

        if (request == null || request.Status != AccountRequestStatus.Pending)
            return false;

        request.Status = AccountRequestStatus.Denied;
        request.ResolvedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}