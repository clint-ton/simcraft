# SimHammer

Self-hosted SimulationCraft web app + desktop app (Tauri).

## Monorepo Structure
- **web/** — Web app (FastAPI backend + Next.js frontend + Docker)
- **desktop/** — Desktop app (Tauri + Rust, planned)

## Architecture (Web)
- **Backend**: Python 3.11 + FastAPI (port 8000)
- **Worker**: ARQ (async Redis queue) processes simc jobs
- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind (port 3000)
- **Database**: SQLite via async SQLAlchemy
- **Queue**: Redis
- **Game Data**: Raidbots static JSON files loaded at startup (items, bonuses, enchants, gems)

## Commands

### Backend
```bash
cd web/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Worker
```bash
cd web/backend
python -m arq worker.tasks.WorkerSettings
```

### Frontend
```bash
cd web/frontend
npm install
npm run dev
```

### Docker
```bash
cd web
docker compose up
```

## Key Patterns
- All DB access is async (aiosqlite)
- API errors return `{"detail": "..."}`
- Frontend polls `/api/sim/{id}` every 2s for job status
- simc runs as subprocess, writes JSON output, which is parsed by result_parser.py
- Item/enchant/gem/bonus data from local JSON files, no Wowhead API calls
- Gold accent color: `#C8992A`
- Deploy only triggers on `web/**` changes
