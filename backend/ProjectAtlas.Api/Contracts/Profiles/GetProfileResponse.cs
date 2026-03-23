namespace ProjectAtlas.Api.Contracts.Profiles;

public record GetProfileResponse(
    Guid Guid,
    string Name,
    string Email,
    string Nickname,// name tag @nickname
    string? PictureUrl,
    string? AboutMe,
    int ActivityScore
);