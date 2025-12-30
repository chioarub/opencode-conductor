# Conductor Plugin for OpenCode

**Measure twice, code once.**

Conductor is an OpenCode plugin that enables **Context-Driven Development**. It turns OpenCode into a proactive project manager that follows a strict protocol to specify, plan, and implement software features and bug fixes.

Instead of just writing code, Conductor ensures a consistent, high-quality lifecycle for every task: **Context -> Spec & Plan -> Implement**.

The philosophy behind Conductor is simple: **control your code**. By treating context as a managed artifact alongside your code, you transform your repository into a single source of truth that drives every agent interaction with deep, persistent project awareness.

---

## 🚀 Key Features

- **Specialized `@conductor` Agent**: A dedicated subagent that acts as a Project Architect and Stewardship officer.
- **Native Slash Commands**: Quick shortcuts like `/c-setup`, `/c-new`, and `/c-implement`.
- **Plan Before You Build**: Automated generation of `spec.md` and `plan.md` based on your project's unique context.
- **Maturity Aware**: Intelligent initialization for both new (Greenfield) and existing (Brownfield) projects.
- **Smart Revert**: A Git-aware revert command that understands logical units of work (tracks, phases, tasks).
- **Synergy with Sisyphus**: Seamlessly integrates with [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode).

## 🛠️ Usage

Conductor manages the entire lifecycle of your development tasks via the `@conductor` agent.

### 1. Set Up the Project (Run Once)
Initializes the `conductor/` directory with your project's "Constitution" (Product vision, Tech Stack, and Workflow rules).
```bash
/c-setup
```

### 2. Start a New Track (Feature or Bug)
Initializes a **track** — a high-level unit of work. Conductor helps you generate a detailed specification and an actionable implementation plan.
```bash
/c-new "Add user authentication using OAuth"
```

### 3. Implement the Track
The agent works through the `plan.md` file, checking off tasks as it completes them, following your workflow strictly (e.g., TDD, commit strategy).
```bash
/c-implement
```

### 4. Check Status & Revert
Monitor progress or undo specific logical units of work.
```bash
/c-status
/c-revert "last task"
```

---

## 📦 Installation

Please see [INSTALL.md](./INSTALL.md) for detailed instructions on building and installing the plugin globally.

## ⚙️ Configuration

You can customize the model used by the `@conductor` agent in your global `opencode.json` or `oh-my-opencode.json`:

```json
{
  "agent": {
    "conductor": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

---

## 🤝 Synergy with oh-my-opencode

If you are using the **OhMyOpenCode** suite, `@conductor` acts as your Technical Lead. While **Sisyphus** manages the overall conversation, he can delegate specialized planning and architectural enforcement tasks to the `@conductor` agent.

---

## 📈 Automated Versioning & Release

This project uses **Semantic Release** to automate versioning and NPM publishing. Version numbers are automatically determined based on commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `fix:` triggers a **patch** release (e.g., 0.1.0 -> 0.1.1)
- `feat:` triggers a **minor** release (e.g., 0.1.0 -> 0.2.0)
- `BREAKING CHANGE:` in footer triggers a **major** release (e.g., 0.1.0 -> 1.0.0)

---

## 📜 Legal

- License: [Apache License 2.0](LICENSE)
