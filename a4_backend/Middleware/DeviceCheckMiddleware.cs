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

        // exact matches for public read endpoints
        if (path == "/api/post" ||
            path == "/api/department")
        {
            await _next(context);
            return;
        }

        // public auth and registration endpoints
        if (path.StartsWith("/api/auth/login") ||
            path.StartsWith("/api/auth/register") ||
            path.StartsWith("/api/device/register") ||
            path.StartsWith("/api/blobstorage/download") ||
            path.StartsWith("/api/picture") ||
            path.StartsWith("/api/register-device"))
        {
            await _next(context);
            return;
        }

        // everything else requires a registered device
        var deviceId = context.Request.Cookies["DeviceId"];

        if (string.IsNullOrEmpty(deviceId) || !await deviceService.IsDeviceRegisteredAsync(deviceId))
        {
            context.Response.StatusCode = 404;
            return;
        }

        await _next(context);
    }
}