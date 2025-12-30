# Installation Guide

Follow these steps to install the Conductor plugin into your OpenCode environment.

## 🚀 Simple Installation (Recommended)

Add the plugin to your global `opencode.json` file. OpenCode will automatically install it from NPM.

**File:** `~/.config/opencode/opencode.json`

```json
{
  "plugin": [
    "opencode-conductor"
  ]
}
```

### First-Run Setup
The first time you start OpenCode with the plugin, it will automatically install the `@conductor` agent and slash commands to your global configuration. You will see a notification when this is complete. **Please restart OpenCode after this first run to enable the slash commands.**

---

## 🛠️ Manual / Development Installation

If you want to install from source or for development:

### 1. Build and Package

```bash
npm install
npm run build
npm pack
```

This generates `opencode-conductor-0.1.0.tgz`.

### 2. Global Installation

```bash
cd ~/.config/opencode
npm install <path-to-tgz>
```

### 3. Register and Bootstrap
Add `"opencode-conductor"` to your `opencode.json` as shown in the simple installation section above. The plugin will handle copying the agent and command files automatically on its first run.

---

## ⚙️ Configuration

### Agent Model
By default, the `@conductor` agent uses your session's default model. We highly recommend pinning it to a "flash" model for speed and efficiency.

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

## 🛠️ Commands Available

Once installed and restarted, you can use:
*   **/c-setup**: Initialize project context.
*   **/c-new**: Create a new feature/bug track.
*   **/c-implement**: Start coding.
*   **/c-status**: View progress.
*   **/c-revert**: Undo work.
