# SimHammer

SimulationCraft web app + desktop app.

## Monorepo Structure
- **frontend/** — Next.js app (shared by web + desktop)
- **backend/** — Cargo workspace: core library, standalone web server, Tauri desktop app
- **desktop/** — Desktop build scripts (npm/Tauri CLI, copy-frontend, generate-latest)
- **data/** — Game data JSON files (fetched from Raidbots, gitignored)

## Architecture

### Rust Backend (shared)
- **Core library** (`backend/core/`): Actix-web routes, game data, addon parser, profileset generator, result parser, simc runner
- **Storage**: `JobStorage` trait with `MemoryStorage` (desktop) and `SqliteStorage` (web, behind `web` feature flag)
- **Game Data**: Raidbots static JSON files loaded at startup from `data/`

### Desktop
- **App** (`backend/desktop/`): Tauri shell, uses `simhammer-core` with `desktop` feature
- **Backend**: Rust + Actix-web (port 17384), in-memory job storage
- **Frontend**: Same Next.js app (static export for Tauri)
- **Sim**: Runs simc directly as subprocess, all CPU cores

### Web
- **Server** (`backend/server/`): Standalone binary, uses `simhammer-core` with `web` feature
- **Backend**: Rust + Actix-web (port 8000), SQLite job storage
- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind (port 3000)

## Commands

### Web
```bash
docker compose up          # Docker (from repo root)
# or manually:
cd backend && cargo run -p simhammer-server
cd frontend && npm run dev
```

### Desktop
```bash
cd desktop
npx tauri dev              # Development
npx tauri build            # Build installer
```

## Cargo Workspace (`backend/`)
```
Cargo.toml          — workspace root (members: core, desktop, server)
core/               — simhammer-core library (features: desktop, web)
desktop/            — simhammer (Tauri desktop app)
server/             — simhammer-server (standalone web server)
```

## Key Patterns
- Frontend shared between web and desktop via `lib/api.ts` (auto-detects API URL)
- All item/enchant/gem/bonus data from local JSON files, no Wowhead API calls
- Wowhead tooltips loaded client-side (hover popups only)
- Single Rust backend serves identical API shape for both web and desktop
- `JobStorage` trait abstracts persistence: `MemoryStorage` (desktop), `SqliteStorage` (web)
- Desktop build uses `output: "export"` with `generateStaticParams` placeholder for `/sim/[id]`
- Gold accent color: `#C8992A`

## Pages
- `/` — Landing page with sim type cards
- `/quick-sim` — Quick Sim (DPS + stat weights)
- `/top-gear` — Top Gear (best gear combination)
- `/drop-finder` — Drop Finder (droptimizer)
- `/sim/[id]` — Sim results with real-time progress
