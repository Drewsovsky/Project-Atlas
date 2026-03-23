using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectAtlas.Api.Contracts.Profiles;

public record CreateProfileRequest
(
    string Name,
    [Required, EmailAddress]string Email,
    string Nickname,// name tag @nickname
    string? PictureUrl,
    [MaxLength(600)]string? AboutMe,
    int ActivityScore
);