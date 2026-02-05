const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function tryGetGitSha() {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString("utf8")
      .trim();
  } catch {
    return "";
  }
}

const repoRoot = path.join(__dirname, "..");
const pkg = safeReadJson(path.join(repoRoot, "package.json")) || {};

const distDir = path.join(repoRoot, "dist");
ensureDir(distDir);

const buildInfo = {
  name: pkg.name || "",
  version: pkg.version || "",
  builtAt: new Date().toISOString(),
  gitSha: tryGetGitSha(),
};

const outPath = path.join(distDir, "build-info.json");
fs.writeFileSync(outPath, JSON.stringify(buildInfo, null, 2) + "\n");
console.log(`[Conductor] Wrote build info: ${outPath}`);
