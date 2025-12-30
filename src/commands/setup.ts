import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import { StateManager } from "../utils/stateManager.js";
import { loadPrompt } from "../utils/promptLoader.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupCommand = (ctx: any): ToolDefinition =>
  tool({
    description: "Sets up the Conductor environment for the project. Call this to start or resume the setup process. IMPORTANT: Do NOT create any todos using 'todowrite' or 'task' tools before or during this command, as it manages its own interactive state and will conflict with continuation enforcers.",
    args: {
      user_input: tool.schema.string().optional().describe("The user's response to a previous question, if applicable."),
    },
    async execute(args: { user_input?: string }) {
      const stateManager = new StateManager(ctx.directory);
      
      // Resolve the absolute path to the templates directory in the distribution
      const templatesDir = join(__dirname, "../templates");
      
      return await loadPrompt("setup.toml", { 
        templatesDir,
        isOMOActive: ctx.isOMOActive ? "true" : "false"
      });
    },
  });
