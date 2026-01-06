import { type Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin/tool";
import { setupCommand } from "./commands/setup.js";
import { newTrackCommand } from "./commands/newTrack.js";
import { implementCommand } from "./commands/implement.js";
import { statusCommand } from "./commands/status.js";
import { revertCommand } from "./commands/revert.js";
import { join, dirname } from "path";
import { homedir } from "os";
import { existsSync, readFileSync } from "fs";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ConductorPlugin: Plugin = async (ctx) => {
  // Detect oh-my-opencode for synergy features
  const configPath = join(homedir(), ".config", "opencode", "opencode.json");
  let isOMOActive = false;

  try {
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      isOMOActive = config.plugin?.some((p: string) => p.includes("oh-my-opencode"));
    }
  } catch (e) {
    // Fallback to filesystem check if config read fails
    const omoPath = join(homedir(), ".config", "opencode", "node_modules", "oh-my-opencode");
    isOMOActive = existsSync(omoPath);
  }

  console.log(`[Conductor] Plugin tools loaded. (OMO Synergy: ${isOMOActive ? "Enabled" : "Disabled"})`);

  const extendedCtx = { ...ctx, isOMOActive };

  return {
    tool: {
      conductor_setup: setupCommand(extendedCtx),
      conductor_new_track: newTrackCommand(extendedCtx),
      conductor_implement: implementCommand(extendedCtx),
      conductor_status: statusCommand(extendedCtx),
      conductor_revert: revertCommand(extendedCtx),
    },
    "tool.execute.before": async (input: any, output: any) => {
      // INTERCEPT: Sisyphus Delegation Hook
      // Purpose: Automatically inject the full Conductor context (Plan, Spec, Workflow, Protocol)
      // whenever the Conductor delegates a task to Sisyphus. This ensures Sisyphus has "Engineering Authority"
      // without needing the LLM to manually copy-paste huge context blocks.
      
      if (input.tool === "delegate_to_agent") {
        const agentName = (output.args.agent_name || output.args.agent || "").toLowerCase();
        
        if (agentName.includes("sisyphus")) {
          console.log("[Conductor] Intercepting Sisyphus delegation. Injecting Context Packet...");
          
          const conductorDir = join(ctx.directory, "conductor");
          const promptsDir = join(__dirname, "prompts");

          // Helper to safely read file content
          const safeRead = async (path: string) => {
             try {
               if (existsSync(path)) return await readFile(path, "utf-8");
             } catch (e) { /* ignore */ }
             return null;
          };

          // 1. Read Project Context Files
          // We need to find the active track to get the correct spec/plan.
          // Since we don't know the track ID easily here, we look for the 'plan.md' that might be in the args
          // OR we just rely on the Conductor having already done the setup. 
          // WAIT: We can't easily guess the track ID here. 
          // BETTER APPROACH: We rely on the generic 'conductor/workflow.md' and 'prompts/implement.toml'.
          // For 'spec.md' and 'plan.md', the Conductor usually puts the path in the message. 
          // However, to be robust, we will read the GLOBAL workflow and the IMPLEMENT prompt.
          // We will explicitly inject the IMPLEMENT PROMPT as requested.
          
          const implementToml = await safeRead(join(promptsDir, "implement.toml"));
          const workflowMd = await safeRead(join(conductorDir, "workflow.md"));
          
          // Construct the injection block
          let injection = "\n\n--- [SYSTEM INJECTION: CONDUCTOR CONTEXT PACKET] ---\n";
          injection += "You are receiving this task from the Conductor Architect.\n";
          
          if (implementToml) {
            injection += "\n### 1. ARCHITECTURAL PROTOCOL (Reference Only)\n";
            injection += "Use this protocol to understand the project's rigorous standards. DO NOT restart the project management lifecycle (e.g. track selection).\n";
            injection += "```toml\n" + implementToml + "\n```\n";
          }

          if (workflowMd) {
             injection += "\n### 2. DEVELOPMENT WORKFLOW\n";
             injection += "Follow these TDD and Commit rules precisely.\n";
             injection += "```markdown\n" + workflowMd + "\n```\n";
          }

          injection += "\n### 3. DELEGATED AUTHORITY\n";
          injection += "- **EXECUTE:** Implement the requested task using the Workflow.\n";
          injection += "- **REFINE:** You have authority to update `plan.md` if it is flawed.\n";
          injection += "- **ESCALATE:** If you modify the Plan or Spec, report 'PLAN_UPDATED' immediately.\n";
          injection += "--- [END INJECTION] ---\n";

          // Append to the objective
          output.args.objective += injection;
        }
      }
    }
  };
};

export default ConductorPlugin;