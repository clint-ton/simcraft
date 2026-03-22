# SimHammer

SimulationCraft made simple. Run sims from your browser or download the desktop app.

**[simhammer.com](https://simhammer.com)** · **[Download Desktop App](https://github.com/sortbek/simcraft/releases/latest)**

## Features

- **Quick Sim** — Paste your SimC addon string, get DPS and ability breakdown
- **Top Gear** — Find the best gear combination from your bags, bank, and vault
- **Drop Finder** — Find the best dungeon/raid drops for your character
- **Stat Weights** — See which stats matter most for your character
- **Desktop App** — Run everything locally with all your CPU cores, no server needed

## Project Structure

```
frontend/          Next.js 14 app (shared by web + desktop)
backend/           Cargo workspace (Rust)
  core/            simhammer-core library (API routes, simc runner, game data)
  server/          simhammer-server (standalone web server binary)
  desktop/         simhammer (Tauri desktop app binary)
desktop/           Desktop build scripts (Tauri CLI, copy-frontend, generate-latest)
data/              Game data JSON files (fetched from Raidbots, gitignored)
docker-compose.yml Web deployment
```

## Web App

### Quick Start (Docker)

```bash
docker compose up --build
```

This builds everything automatically:
- Compiles the Rust backend server
- Builds SimulationCraft from source
- Downloads all game data files from Raidbots
- Builds the Next.js frontend

- Frontend: http://localhost:3000
- API: http://localhost:8000

### Manual Setup

```bash
# Terminal 1 — Backend
cd backend
export SIMC_PATH=/path/to/simc
export DATA_DIR=../data
cargo run -p simhammer-server

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### Deploy to a VPS

1. Clone the repo on your server
2. Run `docker compose up -d --build`
3. Set up nginx as reverse proxy (port 80 → 3000 for frontend, /api/ → 8000 for backend)

## Desktop App

### Download

Grab the latest installer from [GitHub Releases](https://github.com/sortbek/simcraft/releases/latest).

### Build from Source

Prerequisites: Rust, Node.js 20+, simc binary

```bash
cd desktop
npm install
npx tauri dev       # Development
npx tauri build     # Build installer
```

## Game Data

Game data files are fetched from Raidbots and stored in `data/`. To download or update locally:

```bash
bash data/fetch-data.sh data/
```

This reads the [Raidbots metadata.json](https://www.raidbots.com/static/data/live/metadata.json) and downloads all listed files. The Docker build does this automatically.

## Getting a SimC Addon String

1. Install the [SimulationCraft addon](https://www.curseforge.com/wow/addons/simulationcraft) in WoW
2. In-game, type `/simc`
3. Copy the full text from the popup window
4. Paste it into SimHammer

## Architecture

### Web
```
Browser → Next.js (3000) → Rust/Actix-web (8000) → SQLite → simc subprocess
```

### Desktop
```
Tauri Window → Next.js → Rust/Actix-web (17384) → simc subprocess
```

Both use the same Next.js frontend and the same Rust core library (`simhammer-core`). The core provides API routes, addon parsing, profileset generation, and simc process management. Storage is abstracted via a `JobStorage` trait — the web server uses `SqliteStorage`, the desktop app uses `MemoryStorage`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SIMC_PATH` | `/usr/local/bin/simc` | Path to SimulationCraft binary |
| `DATA_DIR` | `./data` | Path to game data JSON files |
| `DATABASE_URL` | `simhammer.db` | SQLite database path (web only) |
| `PORT` | `8000` | Server port |
| `BIND_HOST` | `0.0.0.0` | Server bind address |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL (frontend) |
