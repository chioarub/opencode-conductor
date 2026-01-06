import { tool } from "@opencode-ai/plugin/tool";
import { createConductorCommand } from "../utils/commandFactory.js";

export const setupCommand = createConductorCommand({
  name: "legacy/conductor/commands/conductor/setup.toml",
  description: "Initializes the Conductor in the current project, creating necessary directories and the workflow file.",
  args: {
    user_input: tool.schema.string().optional().describe("The user's response to a previous question, if applicable."),
  },
  requiresSetup: false // Setup command is what creates the setup
});