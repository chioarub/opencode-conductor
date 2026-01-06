import { createConductorCommand } from "../utils/commandFactory.js";

export const statusCommand = createConductorCommand({
  name: "definitions/status.toml",
  description: "Displays the current Conductor status, active tracks, and project health.",
  args: {}
});