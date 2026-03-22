const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const http = require("http");

const ROOT = path.join(__dirname, "..", "..");
const BACKEND_DIR = path.join(ROOT, "backend");
const FRONTEND_DIR = path.join(ROOT, "frontend");

const ext = process.platform === "win32" ? ".exe" : "";
const serverBinary = path.join(BACKEND_DIR, "target", "debug", `simhammer-server${ext}`);

function buildBackend() {
  console.log("[dev] Building Rust backend...");
  execSync("cargo build -p simhammer-server --features desktop", {
    cwd: BACKEND_DIR,
    stdio: "inherit",
  });
  console.log("[dev] Backend built.");
}

function waitForUrl(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      if (Date.now() - start > timeout) {
        return reject(new Error(`Timed out waiting for ${url}`));
      }
      const req = http.get(url, (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 300);
      });
      req.on("error", () => setTimeout(check, 300));
      req.setTimeout(1000, () => {
        req.destroy();
        setTimeout(check, 300);
      });
    }
    check();
  });
}

async function main() {
  // 1. Build backend if binary doesn't exist
  if (!fs.existsSync(serverBinary)) {
    buildBackend();
  } else {
    // Rebuild if source is newer than binary
    try {
      const binaryStat = fs.statSync(serverBinary);
      const mainStat = fs.statSync(path.join(BACKEND_DIR, "server", "src", "main.rs"));
      if (mainStat.mtimeMs > binaryStat.mtimeMs) {
        buildBackend();
      } else {
        console.log("[dev] Backend binary up to date.");
      }
    } catch {
      buildBackend();
    }
  }

  // 2. Start Next.js dev server on a fixed port
  const FRONTEND_PORT = 3000;
  console.log(`[dev] Starting Next.js dev server on port ${FRONTEND_PORT}...`);
  const frontend = spawn("npx", ["next", "dev", "--port", String(FRONTEND_PORT)], {
    cwd: FRONTEND_DIR,
    stdio: "inherit",
    shell: true,
  });

  // 3. Wait for frontend to be ready
  console.log(`[dev] Waiting for frontend (localhost:${FRONTEND_PORT})...`);
  try {
    await waitForUrl(`http://localhost:${FRONTEND_PORT}`);
  } catch {
    console.error("[dev] Frontend did not start in time.");
    frontend.kill();
    process.exit(1);
  }
  console.log("[dev] Frontend ready.");

  // 4. Launch Electron
  console.log("[dev] Starting Electron...");
  const electronPath = require("electron");
  const electron = spawn(electronPath, [path.join(__dirname, "..")], {
    stdio: "inherit",
    env: process.env,
  });

  electron.on("exit", (code) => {
    console.log("[dev] Electron exited.");
    frontend.kill();
    process.exit(code ?? 0);
  });

  // Clean up on ctrl+c
  process.on("SIGINT", () => {
    electron.kill();
    frontend.kill();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    electron.kill();
    frontend.kill();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
