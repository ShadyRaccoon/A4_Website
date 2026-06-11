using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using a4_backend.Options;

namespace a4_backend.Services;

public class EmailSenderService : IEmailSenderService
{
    private readonly EmailSenderOptions _email;
    
    public EmailSenderService(IOptions<EmailSenderOptions> email)
    {
        _email = email.Value;
    }

    public async Task SendEmailAsync(string email, string subject, string message)
    {
        try
        {
            var mimeMessage = new MimeMessage();
            var from = new MailboxAddress(_email.SenderName, _email.SenderEmail);
            mimeMessage.From.Add(from);
            var to = new MailboxAddress("", email);
            mimeMessage.To.Add(to);
            mimeMessage.Subject = subject;
            mimeMessage.Body = new TextPart(TextFormat.Plain) { Text = message };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_email.Host, _email.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_email.SenderEmail, _email.Password);
            await smtp.SendAsync(mimeMessage);
            await smtp.DisconnectAsync(true);

            Console.WriteLine($"Email sent to {email}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email failed: {ex.Message}");
            throw;
        }
    }
}