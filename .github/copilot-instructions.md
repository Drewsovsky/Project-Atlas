# Project Atlas — Copilot Instructions

## Project Overview

Full-stack web app: **Next.js 15 frontend** (TypeScript, App Router) + **.NET 10 backend** (ASP.NET Core Minimal APIs). Database and auth via **Supabase** (PostgreSQL + JWT Bearer).

---

## Frontend

### Technology Stack
- **Next.js 15** with App Router (`src/app/`)
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** for styling
- **Axios** for HTTP (`src/lib/api/client.ts`)
- Path alias `@/*` → `src/*`

### TypeScript Conventions
- Always use `import type` for type-only imports: `import type { User } from '@/types/user'`
- Define component props as a local `type`, not `interface`:
  ```ts
  type ComponentNameProps = {
    prop: string;
    optional?: boolean;
  };
  ```
- Place domain types in `src/types/<domain>.ts` (e.g., `user.ts`, `event.ts`, `post.ts`)
- Functional components as named exports with arrow functions:
  ```ts
  export function ComponentName({ prop }: ComponentNameProps) { ... }
  ```

### Component Rules
- Add `"use client"` at the top of any component that uses hooks, context, or browser APIs
- PascalCase filenames for components (`EventCard.tsx`, `ProfileHeader.tsx`)
- Components live in `src/components/`; pages live in `src/app/`
- Use `useAuth()` from `@/context/AuthContext` for auth state — never read localStorage directly

### API & Services Layer
- All HTTP calls go through `apiClient` from `@/lib/api/client`
- Endpoint paths are defined in the `API_ENDPOINTS` object in `client.ts` — add new endpoints there, not inline
- New domains get a service file in `src/services/<domain>Service.ts`
- Services return typed `Promise<T>` — use `undefined` (not `null`) for missing optional values
- Use mapper functions in `src/lib/api/mappers.ts` to convert backend contract types ↔ frontend types

### Naming
| Entity | Convention | Example |
|--------|------------|---------|
| Components / Pages | PascalCase | `EventCard.tsx` |
| Services / Utilities | camelCase | `eventService.ts` |
| Types | PascalCase | `Event`, `User` |
| Constants | UPPER_SNAKE_CASE | `MAX_POST_IMAGES` |
| Context hooks | `use` prefix | `useAuth()` |

---

## Backend

### Technology Stack
- **.NET 10** Web API — **Minimal APIs only** (no MVC controllers)
- **Supabase** C# SDK for database access
- **JWT Bearer** authentication (Supabase authority)
- OpenAPI/Swagger enabled

### Minimal API Conventions
- Register endpoints via extension methods: `app.MapProfilesEndpoints()`
- Group under a shared prefix using `app.MapGroup("/route")`
- Use `Results.*` return helpers (`Results.Ok()`, `Results.NotFound()`, `Results.CreatedAtRoute()`)
- Require auth with `.RequireAuthorization()` — extract the user ID from `ClaimTypes.NameIdentifier`

```csharp
group.MapPost("/", async (CreateRequest req, SupabaseClient client, HttpContext ctx) =>
{
    var userId = ctx.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    // ...
    return Results.CreatedAtRoute(BindName, new { guid = response.Guid }, response);
}).RequireAuthorization();
```

### Contracts
- Use C# `record` types for all request/response DTOs in `Contracts/<Domain>/`
- Files: `Create<Domain>Request.cs`, `Get<Domain>Response.cs`, `Update<Domain>Request.cs`
- Use data annotations for validation (`[Required]`, `[EmailAddress]`, `[MaxLength(600)]`)

### Models
- Inherit from `BaseModel` (Supabase SDK)
- Decorate with `[Table("table_name")]` and `[Column("column_name")]`
- DB columns: `snake_case` → C# properties: `PascalCase` (e.g., `picture_url` → `PictureUrl`)
- Nullable properties use `?` suffix; non-nullable must have a default or be required

### Naming
| Entity | Convention | Example |
|--------|------------|---------|
| Models | PascalCase | `Profile`, `Event` |
| Contracts | Descriptive record names | `CreateProfileRequest` |
| Routes | lowercase, hyphenated | `/events`, `/event-news` |
| Constants | PascalCase fields | `BaseRoute`, `BindName` |

---

## General Rules

- **Never hardcode secrets or connection strings** — use environment variables / User Secrets (backend) or `.env.local` (frontend)
- **Do not add controllers** to the backend — always use Minimal API extension methods
- **Do not use `any`** in TypeScript — define proper types in `src/types/`
- When adding a new resource (e.g., Events), follow the existing Profiles pattern end-to-end: model → contract → endpoint (backend), type → service → mapper → API_ENDPOINTS (frontend)
- Keep frontend services thin — business logic stays on the backend
