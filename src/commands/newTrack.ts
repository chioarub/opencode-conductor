import { tool } from "@opencode-ai/plugin/tool";
import { createConductorCommand } from "../utils/commandFactory.js";

export const newTrackCommand = createConductorCommand({
  name: "definitions/newTrack.toml",
  description: "Creates a new Development Track (feature/bug/chore) with proper scaffolding.",
  args: {
    description: tool.schema.string().optional().describe("Brief description of the track."),
  },
  additionalContext: async (_, args) => ({
    args: args.description || ""
  })
});