using System;
using System.Security.Claims;
using ProjectAtlas.Api.Contracts.Profiles;
using ProjectAtlas.Api.Models;
using DbClient = Supabase.Client;

namespace ProjectAtlas.Api.Endpoints;

public static class ProfilesEndpoints
{
    private const string BaseRoute = "/profiles";
    private const string BindName = "BIND_NAME";

    public static void MapProfilesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup(BaseRoute);

        // POST
        group.MapPost("/", async (CreateProfileRequest request, DbClient client, HttpContext httpContext) =>
        {
            var uuid = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? httpContext.User.FindFirst("sub")?.Value;

            if (uuid is null)
            {
                return Results.Unauthorized();
            }

            var profile = new Profile
            {
                Guid = Guid.Parse(uuid!),
                Name = request.Name,
                Email = request.Email,
                Nickname = request.Nickname,
                PictureUrl = request.PictureUrl,
                AboutMe = request.AboutMe,
                ActivityScore = request.ActivityScore
            };

            var token = httpContext.Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", "");

            client.Postgrest.Options.Headers["Authorization"] = $"Bearer {token}";

            var result = await client.From<Profile>().Insert(profile);

            var newProfile = result.Models.FirstOrDefault();
            if (newProfile == null)
            {
                return Results.Problem("Failed to create profile.");
            }

            var createProfileResponse = new CreateProfileResponse(
                newProfile.Guid,
                newProfile.Name,
                newProfile.Email,
                newProfile.Nickname,
                newProfile.PictureUrl,
                newProfile.AboutMe,
                newProfile.ActivityScore
            );

            return Results.CreatedAtRoute(BindName, new { guid = createProfileResponse.Guid }, createProfileResponse);
        })
        .RequireAuthorization();

        // GET /
        group.MapGet("/", async (DbClient client) =>
        {
            var result = await client.From<Profile>().Get();
            var profiles = result.Models.Select(profile => new GetProfileResponse(
                profile.Guid,
                profile.Name,
                profile.Email,
                profile.Nickname,
                profile.PictureUrl,
                profile.AboutMe,
                profile.ActivityScore
            )).ToList();

            return Results.Ok(profiles);
        });

        // GET /{guid}
        group.MapGet("/{guid}", async (Guid guid, DbClient client) =>
        {
            var result = await client.From<Profile>().Get();
            var profile = result.Models.FirstOrDefault(p => p.Guid == guid);

            if (profile is null)
            {
                return Results.NotFound();
            }

            var getProfileResponse = new GetProfileResponse(
                profile.Guid,
                profile.Name,
                profile.Email,
                profile.Nickname,
                profile.PictureUrl,
                profile.AboutMe,
                profile.ActivityScore
            );

            return Results.Ok(getProfileResponse);
        })
        .WithName(BindName);

        // PUT
        group.MapPut("/{guid}", async (Guid guid, UpdateProfileRequest request, DbClient client, HttpContext httpContext) =>
        {
            var token = httpContext.Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", "");

            client.Postgrest.Options.Headers["Authorization"] = $"Bearer {token}";

            var result = await client
                .From<Profile>()
                .Where(p => p.Guid == guid)
                .Set(x => x.Name, request.Name)
                .Set(x => x.Email, request.Email)
                .Set(x => x.Nickname, request.Nickname)
                .Set(x => x.PictureUrl, request.PictureUrl)
                .Set(x => x.AboutMe, request.AboutMe)
                .Set(x => x.ActivityScore, request.ActivityScore)
                .Update();

            var updated = result.Models.FirstOrDefault();
            System.Console.WriteLine("LOG: " + result);
            System.Console.WriteLine("LOG: " + result.Models);
            System.Console.WriteLine("LOG: " + updated?.Guid);
            if (updated is null)
            {
                return Results.NotFound();
            }
            return Results.NoContent();
        })
        .RequireAuthorization();

        // DELETE
        group.MapDelete("/{guid}", async (Guid guid, DbClient client, HttpContext httpContext) =>
        {
            var token = httpContext.Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", "");

            client.Postgrest.Options.Headers["Authorization"] = $"Bearer {token}";

            await client
                .From<Profile>()
                .Where(p => p.Guid == guid)
                .Delete();

            return Results.NoContent();
        })
        .RequireAuthorization();
    }
}
