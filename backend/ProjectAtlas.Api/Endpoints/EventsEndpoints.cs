using System;
using ProjectAtlas.Api.Contracts.Events;
using ProjectAtlas.Api.Models;
using DbClient = Supabase.Client;

namespace ProjectAtlas.Api.Endpoints;

public static class EventsEndpoints
{
    private const string BaseRoute = "/events";

    public static void MapEventsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup(BaseRoute);

        // POST 
        group.MapPost("/", async (CreateEventRequest request, DbClient client) =>
        {
            
        });

        // GET
        group.MapGet("/", async (DbClient client) =>
        {
            var result = await client.From<Event>().Get();
            if (result.Models is null)
            {
                return Results.NotFound();
            }

            var events = result.Models.Select(e => new GetEventResponse(
                e.Guid,
                e.Title,
                e.Status,
                e.Description,
                e.CreatedBy,
                e.BannerUrl,
                e.StartAt,
                e.EndAt,
                e.CreatedAt,
                e.UpdatedAt,
                e.UpdatedBy
            )).ToList();

            return Results.Ok(events);
        });
    }
}
