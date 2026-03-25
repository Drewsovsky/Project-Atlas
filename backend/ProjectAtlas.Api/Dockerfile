# Use the official .NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ProjectAtlas.Api.csproj", "."]
RUN dotnet restore "./ProjectAtlas.Api.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "./ProjectAtlas.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ProjectAtlas.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjectAtlas.Api.dll"]