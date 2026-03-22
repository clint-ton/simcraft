const fs = require("fs");
const path = require("path");

const conf = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "backend", "desktop", "tauri.conf.json"), "utf8")
);
const version = conf.version;
const nsisDir = path.join(
  __dirname,
  "..", "backend", "target", "release", "bundle", "nsis"
);

const sigFile = path.join(nsisDir, `SimHammer_${version}_x64-setup.exe.sig`);
if (!fs.existsSync(sigFile)) {
  console.error(`Signature file not found: ${sigFile}`);
  console.error("Run 'npm run build' first.");
  process.exit(1);
}

const signature = fs.readFileSync(sigFile, "utf8").trim();
const exeName = `SimHammer_${version}_x64-setup.exe`;

const latest = {
  version,
  notes: `SimHammer v${version}`,
  pub_date: new Date().toISOString(),
  platforms: {
    "windows-x86_64": {
      signature,
      url: `https://github.com/sortbek/simcraft/releases/download/v${version}/${exeName}`,
    },
  },
};

const outPath = path.join(nsisDir, "latest.json");
fs.writeFileSync(outPath, JSON.stringify(latest, null, 2));
console.log(`Generated ${outPath}`);
