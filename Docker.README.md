# 🐳 Project Atlas Docker Setup

This Docker setup allows you to run both the frontend and backend without installing .NET SDK or Node.js locally.

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy the template and edit with your values
cp .env.example .env
# Edit .env with your actual Supabase keys
```

### 2. Build and Run
```bash
# Development mode (with hot reload)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Development mode in background
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Production mode
docker compose up --build

# Production mode in background
docker compose up -d --build
```

### 2.1 Development Hot Reload Notes
```bash
# Frontend hot reload: http://localhost:3001
# Backend hot reload (dotnet watch): http://localhost:5177
# In dev mode both services watch mounted source files.
```

- On macOS, frontend file watching uses polling (`CHOKIDAR_USEPOLLING=true`, `WATCHPACK_POLLING=1000`) for stable hot reload inside Docker Desktop.

### 3. Using NPM Scripts (from frontend directory)
```bash
cd frontend

# Development with hot reload
npm run docker:dev

# Production mode
npm run docker:up

# Build images
npm run docker:build

# Stop containers
npm run docker:down

# View logs
npm run docker:logs
```

### 4. Optional Helper Script (dev + prod in one command)
Create `scripts/docker-run.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-help}"

case "$MODE" in
     dev)
          docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
          ;;
     dev-bg)
          docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
          ;;
     prod)
          docker compose up --build
          ;;
     prod-bg)
          docker compose up -d --build
          ;;
     down-dev)
          docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
          ;;
     down-prod)
          docker compose down -v
          ;;
     logs-dev)
          docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
          ;;
     logs-prod)
          docker compose logs -f
          ;;
     *)
          echo "Usage: $0 {dev|dev-bg|prod|prod-bg|down-dev|down-prod|logs-dev|logs-prod}"
          exit 1
          ;;
esac
```

Make it executable and run:

```bash
chmod +x scripts/docker-run.sh

# Examples
./scripts/docker-run.sh dev
./scripts/docker-run.sh prod
```

## 📍 Access Points

- **Frontend**: http://localhost:3000 (prod) / http://localhost:3001 (dev)
- **Backend API**: http://localhost:5177
- **API Documentation**: http://localhost:5177 (Swagger UI)

## 🔧 Environment Variables

Required variables in `.env`:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `API_BASE_URL`: Backend API URL (default: http://localhost:5177)

## 🗂️ Docker Architecture

```
┌─────────────────┐    ┌─────────────────┐
│ Frontend        │    │ Backend         │
│ (Next.js)       │◄──►│ (ASP.NET Core)  │
│ Port: 3000/3001 │    │ Port: 5177      │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
              Docker Network
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Stop any running containers
docker compose down

# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5177 | xargs kill -9
```

### Clean Rebuild
```bash
# Remove dev containers and rebuild
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
docker system prune -f
docker compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Remove prod containers and rebuild
docker compose down -v
docker system prune -f
docker compose build --no-cache
docker compose up
```

### View Container Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Verify Hot Reload
```bash
# Frontend: edit any file under frontend/src, then check frontend logs
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f frontend

# Backend: edit any file under backend/ProjectAtlas.Api, then check backend logs
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f backend
```