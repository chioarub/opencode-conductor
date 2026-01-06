import { createConductorCommand } from "../utils/commandFactory.js";

export const statusCommand = createConductorCommand({
  name: "legacy/conductor/commands/conductor/status.toml",
  description: "Displays the current Conductor status, active tracks, and project health.",
  args: {}
});