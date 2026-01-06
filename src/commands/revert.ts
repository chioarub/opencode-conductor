import { createConductorCommand } from "../utils/commandFactory.js";
import { tool } from "@opencode-ai/plugin/tool";

export const revertCommand = createConductorCommand({
  name: "legacy/conductor/commands/conductor/revert.toml",
  description: "Reverts the last commit in the current track and updates the plan.",
  args: {
    target: tool.schema.string().optional().describe("ID or description of what to revert."),
  },
  additionalContext: async (ctx, args) => {
    return {
      target: args.target || "",
    }
  },
});