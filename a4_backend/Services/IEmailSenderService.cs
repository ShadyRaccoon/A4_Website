namespace a4_backend.Services;

public interface IEmailSenderService
{
    Task SendEmailAsync(string email, string subject, string message);
}