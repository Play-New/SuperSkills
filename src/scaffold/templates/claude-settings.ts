import type { AgentTeamConfig } from '../types.js';

export function generateClaudeSettings(agentTeam: AgentTeamConfig, projectName: string): object {
  return {
    "hooks": {
      "SessionStart": agentTeam.hooks.sessionStart.map(hook => ({
        "matcher": hook.matcher,
        "hooks": hook.hooks.map(h => ({
          "type": h.type,
          "command": h.command,
          ...(h.statusMessage ? { "statusMessage": h.statusMessage } : {})
        }))
      })),
      "PreToolUse": agentTeam.hooks.preToolUse.map(hook => ({
        "matcher": hook.matcher,
        "hooks": hook.hooks.map(h => ({
          "type": h.type,
          "prompt": h.prompt.replace(/\[projectName\]/g, projectName),
          ...(h.timeout ? { "timeout": h.timeout } : {})
        }))
      })),
      "PostToolUse": agentTeam.hooks.postToolUse.map(hook => ({
        "matcher": hook.matcher,
        "hooks": hook.hooks.map(h => ({
          "type": h.type,
          "prompt": h.prompt.replace(/\[projectName\]/g, projectName),
          ...(h.timeout ? { "timeout": h.timeout } : {})
        }))
      })),
      "Stop": agentTeam.hooks.stop.map(hook => ({
        "hooks": hook.hooks.map(h => ({
          "type": h.type,
          "prompt": h.prompt.replace(/\[projectName\]/g, projectName),
          ...(h.timeout ? { "timeout": h.timeout } : {})
        }))
      }))
    },
    "permissions": {
      "allow": [
        "Bash(npm test)",
        "Bash(npx playwright test*)",
        "Bash(npx tsc --noEmit)",
        "Read(*)",
        "Glob(*)",
        "Grep(*)"
      ]
    }
  };
}
