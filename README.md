# Project-Atlas - Miniatures Platform

Web platform for miniature enthusiasts to showcase painted miniatures, share profiles, and connect with the community.

The project is built as a learning project while transitioning from mobile development to backend engineering.

## Tech Stack
### Backend

* ASP.NET Core Web API
* Supabase (PostgreSQL + Authentication)

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Axios (API client)

## Development Setup

You can run Project Atlas in two ways:

### Option 1: 🐳 Docker (Recommended)

**No local dependencies required** - just Docker!

```bash
# Quick start
cp .env.example .env
# Edit .env with your Supabase keys

# Development mode (with hot reload)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production mode  
docker compose up
```

See [Docker.README.md](Docker.README.md) for detailed Docker instructions.

### Option 2: 🛠️ Local Development

**Requires .NET SDK and Node.js installed locally**

#### Prerequisites
- .NET 10 SDK
- Node.js 18+ and npm
- Supabase account and project

### Environment Setup

1. **Backend Configuration** - Set up your Supabase keys in user secrets:
   ```bash
   cd backend/ProjectAtlas.Api
   dotnet user-secrets set "Supabase:Key" "your_supabase_anon_key"
   ```

2. **Frontend Configuration** - Create `.env.local` in the frontend directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5177
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Application

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Both Frontend and Backend**:
   ```bash
   cd frontend
   npm run dev:all
   ```
   
   This will start:
   - Backend API at `http://localhost:5177` 
   - Frontend at `http://localhost:3000`

3. **Alternative - Run Separately**:
   ```bash
   # Terminal 1 - Backend
   cd backend/ProjectAtlas.Api
   dotnet run

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

### Integration Status

✅ **Working Features**:
- User profile management (connected to backend `/profiles` API)
- Authentication flow with Supabase JWT
- CORS configured for local development
- Frontend-backend communication established

📋 **Mock Data (Frontend Only)**:
- Posts, Events, Gallery features use dummy data
- Admin features use local storage

🚧 **Planned**: Backend endpoints for Posts, Events, and Gallery features

## Development Goals

This project was created to:

- practice backend architecture
- build production-like .NET backend
- demonstrate full-stack development skills

## License

TBA