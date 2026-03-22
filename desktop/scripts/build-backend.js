const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const backendDir = path.join(__dirname, "..", "..", "backend");
const destDir = path.join(__dirname, "..", "resources", "backend");

console.log("Building Rust backend with desktop feature...");
execSync("cargo build --release -p simhammer-server --features desktop", {
  cwd: backendDir,
  stdio: "inherit",
});

fs.mkdirSync(destDir, { recursive: true });

const ext = process.platform === "win32" ? ".exe" : "";
const binaryName = `simhammer-server${ext}`;
const src = path.join(backendDir, "target", "release", binaryName);
const dest = path.join(destDir, binaryName);

fs.copyFileSync(src, dest);
console.log(`Copied ${binaryName} to desktop/resources/backend/`);
