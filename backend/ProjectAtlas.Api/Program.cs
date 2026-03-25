
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ProjectAtlas.Api.Endpoints;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped(_ =>
    new Supabase.Client(
        builder.Configuration["Supabase:Url"]!,
        builder.Configuration["Supabase:Key"]!,
        new Supabase.SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true
        }));

builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen(swagger =>
{
    swagger.SwaggerDoc("v1", new  Microsoft.OpenApi.OpenApiInfo
    {
        Version = "v1",
        Title = "Project Atlas API",
        Description = "TBA"
    });
});

// Configure CORS for frontend integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(
                  "http://localhost:3000",
                  "https://localhost:3000",
                  "http://localhost:3001",
                  "http://frontend:3000"   // Docker internal network
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["Authentication:Authority"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Authentication:ValidIssuer"],
        ValidateAudience = true,    
        ValidAudience = builder.Configuration["Authentication:ValidAudience"],
        ValidateLifetime = true,
    };
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowFrontend");

// Health check endpoint for Docker
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.MapProfilesEndpoints();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Project Atlas API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
});

app.Run();

