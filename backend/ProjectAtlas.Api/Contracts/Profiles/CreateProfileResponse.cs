using System;

namespace ProjectAtlas.Api.Contracts.Profiles;

public record CreateProfileResponse
(
    Guid Guid,
    string Name,
    string Email,
    string Nickname,// name tag @nickname
    string? PictureUrl,
    string? AboutMe,
    int ActivityScore
);