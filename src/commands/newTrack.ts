import { tool } from "@opencode-ai/plugin/tool";
import { createConductorCommand } from "../utils/commandFactory.js";

export const newTrackCommand = createConductorCommand({
  name: "newTrack.toml",
  description: "Creates a new track (feature/bug) in the Conductor system. IMPORTANT: Do NOT create any todos using 'todowrite' or 'task' tools before or during this command, as it manages its own interactive state and will conflict with continuation enforcers.",
  args: {
    description: tool.schema.string().optional().describe("Brief description of the track."),
  },
  additionalContext: async (_, args) => ({
    args: args.description || ""
  })
});