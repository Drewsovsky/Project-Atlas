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
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production mode
docker compose up

# Build images
docker compose build

# Run in background
docker compose up -d
```

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
# Remove containers and rebuild
docker compose down
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