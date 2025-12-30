# Installation Guide

Follow these steps to install the Conductor plugin into your OpenCode environment.

## Prerequisites

*   [OpenCode](https://opencode.ai/) installed and configured.
*   Node.js and npm installed.

## 1. Build and Package

First, clone this repository and generate the distributable package:

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Create the npm tarball (.tgz)
npm pack
```

This will create a file named something like `opencode-conductor-0.1.0.tgz`.

## 2. Global Installation

Install the generated tarball into your global OpenCode configuration directory. This ensures that the plugin and its dependencies (like `smol-toml`) are available to OpenCode.

```bash
# Replace <path-to-tgz> with the absolute path to the file generated in step 1
cd ~/.config/opencode
npm install <path-to-tgz>
```

## 3. Register the Plugin

Add the plugin to your global `opencode.json` file:

**File:** `~/.config/opencode/opencode.json`

```json
{
  "plugin": [
    "opencode-conductor"
  ]
}
```

## 4. Install the Conductor Agent (Required)

To register the `@conductor` agent, copy the agent definition to your global OpenCode agent directory:

```bash
mkdir -p ~/.config/opencode/agent
cp src/prompts/agent/conductor.md ~/.config/opencode/agent/
```

### Configure the Agent Model (Optional but Recommended)
By default, the agent will use your session's default model. We recommend pinning it to a "flash" model for speed.

**In `~/.config/opencode/opencode.json`:**
```json
{
  "agent": {
    "conductor": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

## 5. Install Slash Commands (Recommended)

To make the Conductor workflows easily accessible via `/` commands in the OpenCode TUI, install the command definitions:

```bash
mkdir -p ~/.config/opencode/command
cp src/prompts/commands/*.md ~/.config/opencode/command/
```

## 6. Verify Installation

Restart your OpenCode session. You should see a toast notification saying "Conductor initialized".

Try the following to verify:
*   Type `@` to see if `conductor` appears in the agent list.
*   Type `/` to see the `c-` prefixed commands.
*   Run `/c-setup` to start the project initialization.

---

## Manual File Creation (If needed)

If you cannot copy the files from the source, create them manually in `~/.config/opencode/`:

### `agent/conductor.md`
```markdown
---
description: Spec-Driven Development Architect. Manages the project lifecycle using the Conductor protocol.
mode: subagent
tools:
  conductor_setup: true
  conductor_new_track: true
  conductor_implement: true
  conductor_status: true
  conductor_revert: true
---
[Insert contents of src/prompts/agent.md here]
```

### `command/c-setup.md`
```markdown
---
description: Setup or resume Conductor environment
agent: conductor
---
Invoke the conductor_setup tool to start or resume the project initialization. Do NOT create todos during this phase.
```