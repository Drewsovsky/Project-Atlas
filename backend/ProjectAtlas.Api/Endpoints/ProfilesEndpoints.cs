using System;
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

        // TODO: Parse Guid from JSON body instead of query parameter, and validate it
        // POST
        group.MapPost("/", async (CreateProfileRequest request, DbClient client) =>
        {
            var profile = new Profile
            {
                Guid = Guid.Parse("bd7100da-46a3-4db3-bfb5-28c534ad2be9"),
                Name = request.Name,
                Email = request.Email,
                Nickname = request.Nickname,
                PictureUrl = request.PictureUrl,
                AboutMe = request.AboutMe,
                ActivityScore = request.ActivityScore
            };

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
        .WithName(BindName)
        .RequireAuthorization();

        // PUT
        group.MapPut("/{guid}", async (Guid guid, UpdateProfileRequest request, DbClient client) =>
        {
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

            if (updated is null)
            {
                return Results.NotFound();
            }
            return Results.NoContent();
        })
        .RequireAuthorization();

        // DELETE
        group.MapDelete("/{guid}", async (Guid guid, DbClient client) =>
        {
            await client
                .From<Profile>()
                .Where(p => p.Guid == guid)
                .Delete();

            return Results.NoContent();
        })
        .RequireAuthorization();
    }
}
