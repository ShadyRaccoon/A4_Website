using a4_backend.Services;

namespace a4_backend.Middleware;

public class DeviceCheckMiddleware
{
    private readonly RequestDelegate _next;

    public DeviceCheckMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IDeviceService deviceService)
    {
        var path = context.Request.Path.Value?.ToLower() ?? "";

        // skip device check for public endpoints
        if (path.StartsWith("/api/auth") ||
            path.StartsWith("/api/post") ||
            path.StartsWith("/api/member") ||
            path.StartsWith("/api/department") ||
            path.StartsWith("/api/device/register") ||
            path.StartsWith("/api/blobstorage") ||
            path.StartsWith("/api/picture") ||
            path.StartsWith("/api/department"))
        {
            await _next(context);
            return;
        }

        var deviceId = context.Request.Cookies["DeviceId"];

        if (string.IsNullOrEmpty(deviceId) || !await deviceService.IsDeviceRegisteredAsync(deviceId))
        {
            context.Response.StatusCode = 404;
            return;
        }

        await _next(context);
    }
}