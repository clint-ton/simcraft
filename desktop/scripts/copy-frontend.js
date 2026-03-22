const fs = require("fs");
const path = require("path");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const src = path.join(__dirname, "..", "..", "frontend", "out");
const dest = path.join(__dirname, "..", "resources", "frontend");

if (!fs.existsSync(src)) {
  console.error("Frontend build output not found at:", src);
  process.exit(1);
}

copyDir(src, dest);
console.log("Copied frontend to desktop/resources/frontend");
