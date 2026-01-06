import { createConductorCommand } from "../utils/commandFactory.js";

export const statusCommand = createConductorCommand({
  name: "status.toml",
  description: "Shows the status of Conductor tracks.",
  args: {}
});