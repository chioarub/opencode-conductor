import { createConductorCommand } from "../utils/commandFactory.js";
import { tool } from "@opencode-ai/plugin/tool";

export const revertCommand = createConductorCommand({
  name: "revert.toml",
  description: "Reverts a Conductor track, phase, or task.",
  args: {
    target: tool.schema.string().optional().describe("ID or description of what to revert."),
  }
});