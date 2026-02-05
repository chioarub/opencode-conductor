import { existsSync, mkdirSync, copyFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function bootstrap(ctx: any) {
  const opencodeConfigDir = join(homedir(), ".config", "opencode");
  const targetAgentDir = join(opencodeConfigDir, "agent");
  const targetCommandDir = join(opencodeConfigDir, "command");

  const sourcePromptsDir = join(__dirname, "../prompts");
  const sourceAgentsDir = join(sourcePromptsDir, "agent");
  const sourceCommandsDir = join(sourcePromptsDir, "commands");

  let installedAnything = false;

  // 1. Ensure directories exist
  if (!existsSync(targetAgentDir)) mkdirSync(targetAgentDir, { recursive: true });
  if (!existsSync(targetCommandDir)) mkdirSync(targetCommandDir, { recursive: true });

  // 2. Install/Update All Agents (conductor, implementer)
  if (existsSync(sourceAgentsDir)) {
    const agents = readdirSync(sourceAgentsDir);
    for (const agentFile of agents) {
      const targetAgentFile = join(targetAgentDir, agentFile);
      copyFileSync(join(sourceAgentsDir, agentFile), targetAgentFile);
      installedAnything = true;
    }
  }

  // 3. Install/Update Commands
  if (existsSync(sourceCommandsDir)) {
    const commands = readdirSync(sourceCommandsDir);
    for (const cmdFile of commands) {
      const targetCmdFile = join(targetCommandDir, cmdFile);
      copyFileSync(join(sourceCommandsDir, cmdFile), targetCmdFile);
      installedAnything = true;
    }
  }

  if (installedAnything) {
    // Do not await toasts during bootstrapping as the TUI might not be ready
    ctx.client.tui.showToast({
      body: {
        title: "Conductor",
        message: "First-run setup: Conductor agent and commands installed globally. Please restart OpenCode to enable slash commands.",
        variant: "info",
        duration: 5000
      }
    }).catch(() => {});
  }
}
