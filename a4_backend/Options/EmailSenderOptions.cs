namespace a4_backend.Options;

public class EmailSenderOptions
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string SenderEmail { get; set; }
    public string SenderName { get; set; }
    public string Password { get; set; }
}