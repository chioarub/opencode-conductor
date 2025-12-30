import { type Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin/tool";
import { setupCommand } from "./commands/setup.js";
import { newTrackCommand } from "./commands/newTrack.js";
import { implementCommand } from "./commands/implement.js";
import { statusCommand } from "./commands/status.js";
import { revertCommand } from "./commands/revert.js";

const ConductorPlugin: Plugin = async (ctx) => {
  console.log("[Conductor] Plugin tools loaded.");

  return {
    tool: {
      conductor_setup: setupCommand(ctx),
      conductor_new_track: newTrackCommand(ctx),
      conductor_implement: implementCommand(ctx),
      conductor_status: statusCommand(ctx),
      conductor_revert: revertCommand(ctx),
    },
  };
};

export default ConductorPlugin;