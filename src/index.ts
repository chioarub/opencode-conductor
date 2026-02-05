import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import ImplementPrompt from "./prompts/conductor/implement.json" with { type: "json" };
import NewTrackPrompt from "./prompts/conductor/newTrack.json" with { type: "json" };
import RevertPrompt from "./prompts/conductor/revert.json" with { type: "json" };
import SetupPrompt from "./prompts/conductor/setup.json" with { type: "json" };
import StatusPrompt from "./prompts/conductor/status.json" with { type: "json" };
import { createDelegationTool } from "./tools/delegate.js";

type BuildInfo = {
  name?: string;
  version?: string;
  builtAt?: string;
  gitSha?: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function tryReadJsonFile(filePath: string): any | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function getBuildInfo(): BuildInfo {
  // When running as a built plugin, dist/index.js lives next to dist/build-info.json
  const candidates = [
    path.join(__dirname, "build-info.json"),
    path.join(__dirname, "..", "dist", "build-info.json"),
  ];

  for (const candidate of candidates) {
    const info = tryReadJsonFile(candidate);
    if (info && typeof info === "object") {
      return info as BuildInfo;
    }
  }

  // Fallback: read version/name from package.json
  const pkg = tryReadJsonFile(path.join(__dirname, "..", "package.json"));
  if (pkg && typeof pkg === "object") {
    return {
      name: pkg.name,
      version: pkg.version,
      builtAt: "",
      gitSha: "",
    };
  }

  return { name: "", version: "", builtAt: "", gitSha: "" };
}

export const MyPlugin: Plugin = async (ctx) => {
  const { directory } = ctx;
  const conductorPath = path.join(directory, "conductor");
  const buildInfo = getBuildInfo();
  const buildStamp = `${buildInfo.name || "opencode-conductor-plugin"}@${buildInfo.version || ""}`
    + (buildInfo.gitSha ? ` (${buildInfo.gitSha})` : "")
    + (buildInfo.builtAt ? ` built ${buildInfo.builtAt}` : "");
  
  const getFilesRecursively = (dir: string, excludePatterns: string[] = []): string[] => {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const relPath = path.relative(directory, filePath);
      
      const shouldExclude = excludePatterns.some(pattern => relPath.includes(pattern));
      if (shouldExclude) return;
      
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFilesRecursively(filePath, excludePatterns));
      } else {
        if (filePath.endsWith(".json") || filePath.endsWith(".md")) {
          results.push(filePath);
        }
      }
    });
    return results;
  };

  const buildFileHierarchy = (fileList: string[]): string => {
    return fileList
      .map((f) => path.relative(directory, f))
      .join("\n                    ");
  };

  const isConductorSetup = (): boolean => {
    const setupStatePath = path.join(conductorPath, "setup_state.json");
    return fs.existsSync(setupStatePath);
  };

  const setupOccurred = isConductorSetup();
  
  const allFiles = fs.existsSync(conductorPath) ? getFilesRecursively(conductorPath) : [];
  const fullFileHierarchy = buildFileHierarchy(allFiles);
  
  const implementFiles = fs.existsSync(conductorPath) 
    ? getFilesRecursively(conductorPath, [
        path.join("conductor", "archive"),
        path.join("conductor", "tracks")
      ])
    : [];
  const tracksIndexPath = path.join(conductorPath, "tracks.md");
  if (fs.existsSync(tracksIndexPath) && !implementFiles.includes(tracksIndexPath)) {
    implementFiles.push(tracksIndexPath);
  }
  const implementFileHierarchy = buildFileHierarchy(implementFiles);

  return {
    config: async (_config) => {
      _config.command = {
        ..._config.command,
        "conductor:implement": {
          agent: "conductor",
          template: ImplementPrompt.prompt + `
            Environment Details: 
              - Directory: ${directory}
              - Conductor Setup: ${setupOccurred}
              - Current Conductor Files (Location: ${directory}/conductor)
                  File Tree (excludes archive and other tracks - read active track on-demand):
                    ${implementFileHierarchy}
          `,
          description: ImplementPrompt.description,
        },
        "conductor:newTrack": {
          agent: "conductor",
          template: NewTrackPrompt.prompt + `
            Environment Details:
              - Directory: ${directory}
              - Conductor Setup: ${setupOccurred}
              - Current Conductor Files (${directory}/conductor)
                  File Tree:
                    ${fullFileHierarchy}
          `,
          description: NewTrackPrompt.description,
        },
        "conductor:revert": {
          agent: "conductor",
          template: RevertPrompt.prompt + `
            Environment Details:
              - Directory: ${directory}
              - Conductor Setup: ${setupOccurred}
              - Current Conductor Files (${directory}/conductor)
                  File Tree:
                    ${fullFileHierarchy}
          `,
          description: RevertPrompt.description,
        },
        "conductor:setup": {
          agent: "conductor",
          template: SetupPrompt.prompt + `
            Environment Details: 
              - Directory: ${directory}
              - Conductor Setup: ${setupOccurred}
              - Current Conductor Files (with tracks) (${directory}/conductor)
                File Tree:
                  ${fullFileHierarchy}

              **CRITICAL ENVIRONTMENTAL OVERRIDE:**: You are not Gemini CLI or a project. You should use ./config/opencode/node_modules/opencode-conductor-plugin for setup operations. .gemini files are not present, use .gitignore
          `,
          description: SetupPrompt.description,
        },
        "conductor:status": {
          agent: "conductor",
          template: StatusPrompt.prompt + `

          **PLUGIN BUILD INFO (PRINT VERBATIM AT TOP OF RESPONSE):**
            ${buildStamp}

          
          ***Current Environment Details***: 
            - Current Working Directory: ${directory}
            - Conductor Setup Process Completed: ${setupOccurred}
            - Current Conductor Files (with tracks) (${directory}/conductor)
                File Tree:
                  ${fullFileHierarchy}
        `,
          description: StatusPrompt.description,
        },
      };
    },
    tools: {
      conductor_delegate: createDelegationTool(ctx),
    },
  };
};
