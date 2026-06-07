using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using a4_backend.Data;
using a4_backend.Models;
using a4_backend.Settings;
using a4_backend.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// User secrets in dev
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 44))));

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;

var corsAllowPolicy = "CorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy( 
        name : corsAllowPolicy, 
        policy =>
        {
            // TODO - add frontend origins here when frontend is done
            policy.WithOrigins();
        }
    );
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
    };
});

builder.Services.AddScoped<TokenService>();

// Identity
builder.Services.AddIdentity<UserAccount, Role>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;
    
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserAccount>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
    await DatabaseSeeder.SeedAsync(context, userManager, roleManager);
}

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(corsAllowPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();