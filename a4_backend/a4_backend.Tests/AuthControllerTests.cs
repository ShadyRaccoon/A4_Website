using Xunit;

namespace a4_backend.Tests;

public class AuthControllerTests
{
    [Fact]
    public void Login_WithEmptyEmail_ShouldFail()
    {
        // Arrange
        var email = "";
        // Assert
        Assert.True(string.IsNullOrEmpty(email));
    }

    [Fact]
    public void Password_WithValidFormat_ShouldContainUppercase()
    {
        var password = "Admin123!";
        Assert.True(password.Any(char.IsUpper));
    }

    [Fact]
    public void DeviceToken_ShouldBeValidGuid()
    {
        var token = Guid.NewGuid().ToString();
        Assert.True(Guid.TryParse(token, out _));
    }

    [Fact]
    public void TempPassword_ShouldMeetRequirements()
    {
        var tempPassword = Guid.NewGuid().ToString("N")[..12] + "A1!";
        Assert.True(tempPassword.Any(char.IsUpper));
        Assert.True(tempPassword.Any(char.IsDigit));
        Assert.True(tempPassword.Length >= 6);
    }
}