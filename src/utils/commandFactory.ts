import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "smol-toml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CommandOptions {
  name: string; // The name of the TOML file (e.g., "newTrack.toml")
  description: string;
  args?: any; // Tool arguments schema
  requiresSetup?: boolean; // Defaults to true
  additionalContext?: (ctx: any, args: any) => Promise<Record<string, string>>;
}

export const createConductorCommand = (options: CommandOptions) => (ctx: any): ToolDefinition =>
  tool({
    description: options.description,
    args: options.args || {},
    async execute(args: any) {
      // 1. Setup Check
      if (options.requiresSetup !== false) {
        const conductorDir = join(ctx.directory, "conductor");
        if (!existsSync(join(conductorDir, "product.md"))) {
          return "Conductor is not set up. Please run `conductor_setup`.";
        }
      }

      // 2. Load Prompt from TOML
      const promptPath = join(__dirname, "../prompts", options.name);
      let promptText = "";
      
      try {
        const content = await readFile(promptPath, "utf-8");
        const parsed = parse(content) as { prompt: string };
        promptText = parsed.prompt;
      } catch (error) {
        throw new Error(`Failed to load prompt from ${promptPath}: ${error}`);
      }

      // 3. Prepare Replacements
      const replacements: Record<string, string> = {
        isOMOActive: ctx.isOMOActive ? "true" : "false",
        templatesDir: join(dirname(dirname(__dirname)), "dist/templates") // Fixing template path for setup
      };

      // 4. Inject Additional Context (e.g. from args)
      if (options.additionalContext) {
        const extra = await options.additionalContext(ctx, args);
        Object.assign(replacements, extra);
      }

      // 5. Apply Replacements
      for (const [key, value] of Object.entries(replacements)) {
        promptText = promptText.replaceAll(`{{${key}}}`, value || "");
      }

      return promptText;
    },
  });
