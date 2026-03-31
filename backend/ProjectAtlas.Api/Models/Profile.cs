using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ProjectAtlas.Api.Models;

[Table("profiles")]
public class Profile : BaseModel
{
    [Column("guid")]
    public Guid Guid { get; set; }

    [Column("name")]
    public string Name { get; set; }

    [Column("email")]
    public string Email { get; set; }

    [Column("nickname")]
    public string Nickname { get; set; } // name tag @nickname

    [Column("picture_url")]
    public string? PictureUrl { get; set; }

    [Column("about_me")]
    public string? AboutMe { get; set; }

    [Column("activity_score")]
    public int ActivityScore { get; set; }
}
