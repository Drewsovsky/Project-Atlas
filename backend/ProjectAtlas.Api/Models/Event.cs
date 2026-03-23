using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ProjectAtlas.Api.Models;

[Table("events")]
public class Event : BaseModel
{
    [PrimaryKey("guid")]
    public Guid Guid { get; set; }

    [Column("title")]
    public string Title { get; set; }

    [Column("status")]
    public int Status { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("created_by")]
    public Guid CreatedBy { get; set; }

    [Column("banner_url")]
    public string? BannerUrl { get; set; }

    [Column("start_at")]
    public DateTime StartAt { get; set; }

    [Column("end_at")]
    public DateTime EndAt { get; set; }
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [Column("updated_by")]
    public Guid UpdatedBy { get; set; }
}
