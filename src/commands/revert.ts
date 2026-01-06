import { createConductorCommand } from "../utils/commandFactory.js";
import { tool } from "@opencode-ai/plugin/tool";

export const revertCommand = createConductorCommand({
  name: "definitions/revert.toml",
  description: "Reverts the last commit in the current track and updates the plan.",
  args: {
    target: tool.schema.string().optional().describe("ID or description of what to revert."),
  }
});