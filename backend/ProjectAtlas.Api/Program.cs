using ProjectAtlas.Api.Endpoints;

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

var app = builder.Build();

app.MapProfilesEndpoints();

app.Run();

