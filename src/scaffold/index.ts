import fs from 'fs-extra';
import path from 'path';
import type { DiscoveryResult } from '../discovery/types.js';
import type { SelectionResult } from '../catalog/types.js';
import type { ScaffoldInput, ScaffoldOptions, ScaffoldResult, AgentTeamConfig, SkillConfig, TeammateConfig } from './types.js';
import { generateClaudeMd } from './templates/claude-md.js';
import { generateEnvExample } from './templates/env-example.js';
import { generateClaudeSettings } from './templates/claude-settings.js';
import { generatePackageJson } from './templates/package-json.js';
import { generateProjectFiles } from './templates/project-files.js';
import { generateSkillAgents } from './templates/skill-agents.js';
import { generateSkillCommands } from './templates/skill-commands.js';
import {
  createStrategyPrompt,
  createDesignPrompt,
  createTrustPrompt,
  createEfficiencyPrompt,
  createTestingPrompt
} from './templates/teammate-prompts.js';

export type { ScaffoldInput, ScaffoldOptions, ScaffoldResult, AgentTeamConfig, SkillConfig, TeammateConfig };

export async function scaffold(
  input: ScaffoldInput,
  options: ScaffoldOptions
): Promise<ScaffoldResult> {
  const { discovery, tools } = input;
  const { outputDir } = options;

  const projectName = slugify(discovery.projectName);
  const projectPath = path.resolve(outputDir, projectName);

  // Ensure output directory exists
  await fs.ensureDir(projectPath);

  const filesCreated: string[] = [];

  // Generate CLAUDE.md
  const claudeMd = generateClaudeMd(discovery, tools);
  await fs.writeFile(path.join(projectPath, 'CLAUDE.md'), claudeMd);
  filesCreated.push('CLAUDE.md');

  // Generate .env.example
  const envExample = generateEnvExample(tools);
  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  filesCreated.push('.env.example');

  // Generate agent team config
  const agentTeam = createAgentTeamConfig(discovery, tools);

  // Generate .claude/settings.json with real hooks
  const claudeSettings = generateClaudeSettings(agentTeam, projectName);
  await fs.ensureDir(path.join(projectPath, '.claude'));
  await fs.writeFile(
    path.join(projectPath, '.claude', 'settings.json'),
    JSON.stringify(claudeSettings, null, 2)
  );
  filesCreated.push('.claude/settings.json');

  // Generate .claude/agents/ subagent files
  const agentFiles = generateSkillAgents(discovery, tools);
  for (const [filePath, content] of Object.entries(agentFiles)) {
    const fullPath = path.join(projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content);
    filesCreated.push(filePath);
  }

  // Generate .claude/skills/ skill command files
  const skillFiles = generateSkillCommands(discovery);
  for (const [filePath, content] of Object.entries(skillFiles)) {
    const fullPath = path.join(projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content);
    filesCreated.push(filePath);
  }

  // Generate first-run hook script
  const hookScript = generateFirstRunScript();
  const hookScriptPath = path.join(projectPath, '.claude', 'hooks', 'first-run-check.sh');
  await fs.ensureDir(path.dirname(hookScriptPath));
  await fs.writeFile(hookScriptPath, hookScript, { mode: 0o755 });
  filesCreated.push('.claude/hooks/first-run-check.sh');

  // Generate package.json
  const packages = tools.all.map(s => s.tool.sdk).filter((s): s is string => s !== null);
  const packageJson = generatePackageJson(projectName, packages);
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  filesCreated.push('package.json');

  // Generate project structure
  const projectFiles = await generateProjectFiles(discovery, tools);
  for (const [filePath, content] of Object.entries(projectFiles)) {
    const fullPath = path.join(projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content);
    filesCreated.push(filePath);
  }

  // Generate .gitignore
  const gitignore = `node_modules/
.next/
.env
.env.local
dist/
.DS_Store
`;
  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
  filesCreated.push('.gitignore');

  return {
    projectPath,
    filesCreated,
    packagesToInstall: packages,
    envVars: tools.all.flatMap(s => s.tool.envVars),
    agentTeam
  };
}

function createAgentTeamConfig(discovery: DiscoveryResult, tools?: SelectionResult): AgentTeamConfig {
  const skills: SkillConfig[] = [
    {
      name: 'strategy',
      focus: 'EIID alignment, CLAUDE.md sync, architectural decisions',
      triggers: ['every commit', 'new features', 'weekly review'],
      systemPrompt: createStrategyPrompt(discovery)
    },
    {
      name: 'design',
      focus: 'shadcn components, design tokens, brand voice, accessibility',
      triggers: ['changes in components/', 'changes in app/**/page.tsx'],
      systemPrompt: createDesignPrompt(discovery)
    },
    {
      name: 'trust',
      focus: 'OWASP top 10, auth, GDPR, data handling, input validation',
      triggers: ['pre-commit on api/', 'pre-commit on auth/', 'pre-commit on lib/db/'],
      systemPrompt: createTrustPrompt(discovery)
    },
    {
      name: 'efficiency',
      focus: 'Bundle size, Core Web Vitals, N+1 queries, API costs',
      triggers: ['pre-commit', 'weekly cost review'],
      systemPrompt: createEfficiencyPrompt(discovery, tools)
    },
    {
      name: 'testing',
      focus: 'vitest, Playwright E2E, accessibility audits, regression prevention',
      triggers: ['pre-stop', 'task-completed'],
      systemPrompt: createTestingPrompt(discovery)
    }
  ];

  return {
    skills,
    hooks: {
      sessionStart: [{
        matcher: 'startup',
        hooks: [{
          type: 'command',
          command: '"$CLAUDE_PROJECT_DIR"/.claude/hooks/first-run-check.sh',
          statusMessage: 'Checking project setup...'
        }]
      }],
      preToolUse: [{
        matcher: 'Bash',
        hooks: [{
          type: 'prompt',
          prompt: 'Security check for [projectName]. Check if this command is safe: $ARGUMENTS. Look for: hardcoded secrets, rm -rf, SQL injection via shell, exposure of sensitive data. Respond {"ok": true} if safe, {"ok": false, "reason": "..."} if dangerous.',
          timeout: 15
        }]
      }],
      postToolUse: [{
        matcher: 'Write|Edit',
        hooks: [{
          type: 'prompt',
          prompt: 'Security scan for [projectName]. Check this file change for: hardcoded API keys, SQL injection, XSS, PII exposure, missing auth. $ARGUMENTS. Respond {"ok": true} or {"ok": false, "reason": "..."}.',
          timeout: 20
        }]
      }],
      stop: [{
        hooks: [{
          type: 'agent',
          prompt: 'Verify before stopping: 1) Run `npm test` and check all tests pass. 2) If Playwright tests exist, run them. 3) Check no TODO items left incomplete. $ARGUMENTS. Respond {"ok": true} if everything passes, {"ok": false, "reason": "..."} with failure details.',
          timeout: 120
        }]
      }]
    }
  };
}

function generateFirstRunScript(): string {
  return `#!/bin/bash
# First-run detection for SuperSkills projects
# This hook checks if the project has been set up and suggests init skills

MISSING=()

if [ ! -d "node_modules" ]; then
  MISSING+=("node_modules not found - run: npm install")
fi

if [ ! -f ".env.local" ]; then
  MISSING+=(".env.local not found - run: cp .env.example .env.local")
fi

# Check if globals.css has been customized (design-init not run)
if [ -f "src/app/globals.css" ]; then
  LINE_COUNT=$(wc -l < "src/app/globals.css")
  if [ "$LINE_COUNT" -lt 10 ]; then
    MISSING+=("Design not configured - run: /design-init")
  fi
fi

# Check if any test files exist
if [ ! -d "tests" ] && [ ! -d "__tests__" ]; then
  MISSING+=("No tests found - run: /testing-init")
fi

if [ \${#MISSING[@]} -gt 0 ]; then
  echo "{"
  echo "  \\"additionalContext\\": \\"This project needs initial setup. Suggest the user run these skills:\\\\n"
  for item in "\${MISSING[@]}"; do
    echo "- $item\\\\n"
  done
  echo "Available init skills: /strategy-init, /design-init, /trust-init, /efficiency-init, /testing-init\\""
  echo "}"
fi
`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
