namespace ProjectAtlas.Api.Contracts.Events;

public record  GetEventResponse(
    Guid Guid,
    string Title,
    int Status,
    string? Description,
    Guid CreatedBy,
    string? BannerUrl,
    DateTime? StartAt,
    DateTime? EndAt,
    DateTime? CreatedAt,
    DateTime? UpdatedAt,
    Guid UpdatedBy
);
