namespace ProjectAtlas.Api.Contracts.Events;

public record  CreateEventRequest(
    string Title,
    int Status,
    string? Description,
    Guid CreatedBy,
    string? BannerUrl,
    DateTime? StartAt,
    DateTime? EndAt,
    Guid? UpdatedBy
);

