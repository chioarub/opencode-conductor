import { tool } from "@opencode-ai/plugin/tool";
import { createConductorCommand } from "../utils/commandFactory.js";

export const setupCommand = createConductorCommand({
  name: "setup.toml",
  description: "Sets up the Conductor environment for the project. Call this to start or resume the setup process. IMPORTANT: Do NOT create any todos using 'todowrite' or 'task' tools before or during this command, as it manages its own interactive state and will conflict with continuation enforcers.",
  args: {
    user_input: tool.schema.string().optional().describe("The user's response to a previous question, if applicable."),
  },
  requiresSetup: false // Setup command is what creates the setup
});