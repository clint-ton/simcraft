const { execSync } = require("child_process");

const PORTS = [3000, 8000, 17384];

for (const port of PORTS) {
  try {
    const lines = execSync("netstat -ano", { encoding: "utf8" }).split("\n");
    const match = lines.find((l) => l.includes(`:${port}`) && l.includes("LISTEN"));
    if (match) {
      const pid = match.trim().split(/\s+/).pop();
      execSync(`taskkill /F /PID ${pid}`);
      console.log(`Killed PID ${pid} on port ${port}`);
    }
  } catch {}
}
