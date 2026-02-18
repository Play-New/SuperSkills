#!/usr/bin/env node

// Check Node.js version before anything else
const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);
if (nodeVersion < 20) {
  console.error(`\n  SuperSkills requires Node.js 20 or later. You have ${process.versions.node}.`);
  console.error('  Install the latest LTS: https://nodejs.org\n');
  process.exit(1);
}

import { Command } from 'commander';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

import { runDiscovery, processJsonInput, getInputJsonSchema, ValidationError } from './discovery/index.js';
import { DiscoveryResultSchema } from './discovery/schema.js';
import { selectTools, loadCatalog, getSdkPackages, getEnvVars } from './catalog/index.js';
import { runToolSelection } from './catalog/ui.js';
import { scaffold } from './scaffold/index.js';
import { runScaffold } from './scaffold/ui.js';
import type { DiscoveryResult } from './discovery/types.js';
import type { SelectionResult } from './catalog/types.js';

// Load saved API key from ~/.superskills/.env if not in environment
const savedEnvPath = path.join(os.homedir(), '.superskills', '.env');
if (!process.env.ANTHROPIC_API_KEY && fs.pathExistsSync(savedEnvPath)) {
  const envContent = fs.readFileSync(savedEnvPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const program = new Command();

const VERSION = '0.1.0';

function displayBanner(): void {
  console.log('');
  console.log(pc.cyan('   ____                       ____  __   _ ____     '));
  console.log(pc.cyan('  / ___| _   _ _ __   ___ _ _/ ___|| | _(_) | |___ '));
  console.log(pc.cyan('  \\___ \\| | | | \'_ \\ / _ \\ \'__\\___ \\| |/ / | | / __|'));
  console.log(pc.cyan('   ___) | |_| | |_) |  __/ |  ___) |   <| | | \\__ \\'));
  console.log(pc.cyan('  |____/ \\__,_| .__/ \\___|_| |____/|_|\\_\\_|_|_|___/'));
  console.log(pc.cyan('              |_|                                   '));
  console.log(pc.dim(`  v${VERSION} — business problem in, working project out`));
  console.log('');
}

interface DiscoveryOptions {
  verbose?: boolean;
  json?: boolean;
  input?: string;
  output?: string;
  schema?: boolean;
}

interface ToolsOptions {
  verbose?: boolean;
  json?: boolean;
  input?: string;
  output?: string;
  catalog?: boolean;
}

interface ScaffoldOptions {
  verbose?: boolean;
  json?: boolean;
  discovery?: string;
  tools?: string;
  output?: string;
}

program
  .name('superskills')
  .description('Skills that amplify human capabilities for AI-native product development')
  .version(VERSION);

// Discovery command
program
  .command('discovery')
  .alias('d')
  .description('Strategic planning for AI-native projects')
  .option('-v, --verbose', 'Show detailed logs')
  .option('--json', 'JSON output mode (no interactive prompts)')
  .option('-i, --input <file>', 'Input JSON file (requires --json)')
  .option('-o, --output <file>', 'Output JSON file (default: stdout)')
  .option('--schema', 'Print input JSON schema and exit')
  .action(async (options: DiscoveryOptions) => {
    try {
      if (options.schema) {
        console.log(JSON.stringify(getInputJsonSchema(), null, 2));
        return;
      }

      if (options.json) {
        await runDiscoveryJsonMode(options);
      } else {
        displayBanner();
        const result = await runDiscovery();
        if (!result) {
          process.exit(1);
        }
      }
    } catch (error) {
      handleError(error, options.json);
    }
  });

// Tools command
program
  .command('tools')
  .alias('t')
  .description('Select tools based on discovery result')
  .option('-v, --verbose', 'Show detailed logs')
  .option('--json', 'JSON output mode (no interactive prompts)')
  .option('-i, --input <file>', 'Discovery result JSON file (requires --json)')
  .option('-o, --output <file>', 'Output JSON file (default: stdout)')
  .option('--catalog', 'Print full tools catalog and exit')
  .action(async (options: ToolsOptions) => {
    try {


      if (options.catalog) {
        const catalog = await loadCatalog();
        console.log(JSON.stringify(catalog, null, 2));
        return;
      }

      if (options.json) {
        await runToolsJsonMode(options);
      } else {
        displayBanner();

        if (!options.input) {
          console.log(pc.yellow('  No discovery result provided.'));
          console.log(pc.dim('  Running discovery first...\n'));

          const discoveryResult = await runDiscovery();
          if (!discoveryResult) {
            process.exit(1);
          }

          const toolsResult = await runToolSelection(discoveryResult);
          if (!toolsResult) {
            process.exit(1);
          }
        } else {
          const discoveryResult = await fs.readJSON(options.input) as DiscoveryResult;
          const toolsResult = await runToolSelection(discoveryResult);
          if (!toolsResult) {
            process.exit(1);
          }
        }
      }
    } catch (error) {
      handleError(error, options.json);
    }
  });

// Scaffold command
program
  .command('scaffold')
  .alias('s')
  .description('Generate project with Agent Team configured')
  .option('-v, --verbose', 'Show detailed logs')
  .option('--json', 'JSON output mode (no interactive prompts)')
  .option('-d, --discovery <file>', 'Discovery result JSON file')
  .option('-t, --tools <file>', 'Tools selection JSON file')
  .option('-o, --output <dir>', 'Output directory (default: ./)')
  .action(async (options: ScaffoldOptions) => {
    try {


      if (options.json) {
        await runScaffoldJsonMode(options);
      } else {
        displayBanner();

        // Run full pipeline if no inputs provided
        let discoveryResult: DiscoveryResult;
        let toolsResult: SelectionResult;

        if (options.discovery) {
          discoveryResult = await readAndValidateDiscovery(options.discovery);
        } else {
          console.log(pc.yellow('  No discovery result provided.'));
          console.log(pc.dim('  Running discovery first...\n'));

          const result = await runDiscovery();
          if (!result) {
            process.exit(1);
          }
          discoveryResult = result;
        }

        if (options.tools) {
          toolsResult = await fs.readJSON(options.tools) as SelectionResult;
        } else {
          console.log('');
          const result = await runToolSelection(discoveryResult);
          if (!result) {
            process.exit(1);
          }
          toolsResult = result;
        }

        console.log('');
        const scaffoldResult = await runScaffold(discoveryResult, toolsResult);
        if (!scaffoldResult) {
          process.exit(1);
        }
      }
    } catch (error) {
      handleError(error, options.json);
    }
  });

// JSON mode handlers
async function runDiscoveryJsonMode(options: DiscoveryOptions): Promise<void> {
  const inputData = await getInputData(options.input);
  const result = await processJsonInput(inputData);
  await outputResult(result, options.output);
}

async function runToolsJsonMode(options: ToolsOptions): Promise<void> {
  if (!options.input) {
    throw new Error('--input required in JSON mode. Provide a discovery result file.');
  }

  const discoveryResult = await fs.readJSON(options.input) as DiscoveryResult;
  const selection = await selectTools(discoveryResult);

  const output = {
    tools: selection.all.map(s => ({
      id: s.tool.id,
      name: s.tool.name,
      category: s.tool.category,
      sdk: s.tool.sdk,
      reason: s.reason,
      required: s.required
    })),
    packages: getSdkPackages(selection),
    envVars: getEnvVars(selection)
  };

  await outputResult(output, options.output);
}

async function runScaffoldJsonMode(options: ScaffoldOptions): Promise<void> {
  if (!options.discovery) {
    throw new Error('--discovery required in JSON mode.');
  }

  const discoveryResult = await readAndValidateDiscovery(options.discovery);
  const toolsResult = options.tools
    ? await fs.readJSON(options.tools) as SelectionResult
    : await selectTools(discoveryResult);

  const result = await scaffold(
    { discovery: discoveryResult, tools: toolsResult },
    { outputDir: options.output || './' }
  );

  console.log(JSON.stringify({
    projectPath: result.projectPath,
    filesCreated: result.filesCreated,
    packagesToInstall: result.packagesToInstall,
    envVars: result.envVars,
    agentTeam: {
      skills: result.agentTeam.skills.map(s => s.name),
      hooks: result.agentTeam.hooks
    }
  }, null, 2));
}

async function readAndValidateDiscovery(filePath: string): Promise<DiscoveryResult> {
  if (!await fs.pathExists(filePath)) {
    throw new Error(`Discovery file not found: ${filePath}`);
  }

  const raw = await fs.readJSON(filePath);

  try {
    return DiscoveryResultSchema.parse(raw) as DiscoveryResult;
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as { issues: Array<{ path: Array<string | number>; message: string }> };
      const details = zodError.issues.map(i =>
        `  ${i.path.join('.')}: ${i.message}`
      ).join('\n');
      throw new Error(`Invalid discovery file. Check the JSON structure:\n${details}`);
    }
    throw error;
  }
}

async function getInputData(inputFile?: string): Promise<unknown> {
  if (inputFile) {
    if (!await fs.pathExists(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }
    return fs.readJSON(inputFile);
  }

  const stdin = await readStdin();
  if (!stdin) {
    throw new Error('No input provided. Use --input <file> or pipe JSON to stdin.');
  }
  return JSON.parse(stdin);
}

async function outputResult(result: unknown, outputFile?: string): Promise<void> {
  const output = JSON.stringify(result, null, 2);

  if (outputFile) {
    await fs.writeJSON(outputFile, result, { spaces: 2 });
  } else {
    console.log(output);
  }
}

async function readStdin(): Promise<string | null> {
  if (process.stdin.isTTY) {
    return null;
  }

  return new Promise((resolve) => {
    let data = '';
    let ended = false;
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      ended = true;
      resolve(data || null);
    });
    setTimeout(() => {
      if (!ended && !data) resolve(null);
    }, 1000);
  });
}

function handleError(error: unknown, jsonMode?: boolean): void {
  if (jsonMode) {
    if (error instanceof ValidationError) {
      console.error(JSON.stringify({ error: 'Validation failed', details: error.errors }));
    } else {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(JSON.stringify({ error: message }));
    }
  } else {
    if (error instanceof Error) {
      const msg = error.message;
      console.error(pc.red(`\n  Error: ${msg}\n`));

      // Helpful hints for common errors
      if (msg.includes('ANTHROPIC_API_KEY')) {
        console.error(pc.dim('  Get a key at: https://console.anthropic.com/settings/keys'));
        console.error(pc.dim('  Then run: export ANTHROPIC_API_KEY=sk-ant-...\n'));
      } else if (msg.includes('ENOENT') || msg.includes('not found')) {
        console.error(pc.dim('  Check the file path and try again.\n'));
      } else if (msg.includes('JSON')) {
        console.error(pc.dim('  The input file must be valid JSON. Use --schema to see the expected format.\n'));
      } else if (msg.includes('EACCES') || msg.includes('permission')) {
        console.error(pc.dim('  Check file permissions on the output directory.\n'));
      }
    }
  }
  process.exit(1);
}

// Init command — one-time setup
program
  .command('init')
  .description('One-time setup: save API key and configure Claude Code integration')
  .action(async () => {
    try {
      displayBanner();
      console.log('  One-time setup. Saves your API key and configures Claude Code.\n');

      // Step 1: API key
      let apiKey = process.env.ANTHROPIC_API_KEY || '';

      if (apiKey) {
        p.log.info(`API key already set (starts with ${apiKey.slice(0, 10)}...)`);
      } else {
        p.log.info(
          `Get an Anthropic API key (free tier available):\n` +
          pc.cyan(`  https://console.anthropic.com/settings/keys`)
        );

        const key = await p.text({
          message: 'Paste your Anthropic API key:',
          placeholder: 'sk-ant-api03-...',
          validate: (v: string | undefined) => {
            if (!v) return 'API key is required';
            if (!v.startsWith('sk-ant-')) return 'Should start with sk-ant-';
            return undefined;
          }
        });

        if (p.isCancel(key)) {
          p.cancel('Cancelled');
          process.exit(0);
        }

        apiKey = key as string;
      }

      // Save to ~/.superskills/.env
      const superskillsDir = path.join(os.homedir(), '.superskills');
      await fs.ensureDir(superskillsDir);
      const envPath = path.join(superskillsDir, '.env');
      await fs.writeFile(
        envPath,
        `# SuperSkills API key (saved by superskills init)\nANTHROPIC_API_KEY=${apiKey}\n`,
        { mode: 0o600 }
      );
      process.env.ANTHROPIC_API_KEY = apiKey;
      p.log.success(`API key saved to ~/.superskills/.env (readable only by you)`);

      // Step 2: Claude Code integration
      const claudeDir = path.join(os.homedir(), '.claude');
      const claudeMdPath = path.join(claudeDir, 'CLAUDE.md');
      await fs.ensureDir(claudeDir);

      const claudeCodeInstructions = generateClaudeCodeInstructions();

      if (await fs.pathExists(claudeMdPath)) {
        const existing = await fs.readFile(claudeMdPath, 'utf-8');
        if (existing.includes('SuperSkills')) {
          p.log.info('~/.claude/CLAUDE.md already has SuperSkills instructions');
        } else {
          await fs.appendFile(claudeMdPath, '\n\n' + claudeCodeInstructions);
          p.log.success('Added SuperSkills instructions to ~/.claude/CLAUDE.md');
        }
      } else {
        await fs.writeFile(claudeMdPath, claudeCodeInstructions);
        p.log.success('Created ~/.claude/CLAUDE.md with SuperSkills instructions');
      }

      console.log('');
      p.note(
        pc.bold('From the terminal:\n') +
        pc.cyan('  npx superskills\n\n') +
        pc.bold('From Claude Code:\n') +
        pc.dim('  Just describe your business problem.\n') +
        pc.dim('  Claude Code does the EIID analysis itself (no API key needed).\n') +
        pc.dim('  Then calls superskills scaffold to generate the project.'),
        'Ready to use'
      );

      p.outro(pc.green('Setup complete'));
    } catch (error) {
      handleError(error);
    }
  });

// Default action — full pipeline (discovery → tools → scaffold)
program
  .action(async () => {
    try {
      displayBanner();

      // Check for API key before starting the pipeline
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log(pc.yellow('  No API key found.\n'));
        console.log('  SuperSkills needs an Anthropic API key for AI analysis.');
        console.log(pc.dim('  Get one at: https://console.anthropic.com/settings/keys\n'));

        const key = await p.text({
          message: 'Paste your Anthropic API key (or run `superskills init` to save it):',
          placeholder: 'sk-ant-api03-...',
          validate: (v: string | undefined) => {
            if (!v) return 'API key is required. Get one at console.anthropic.com/settings/keys';
            if (!v.startsWith('sk-ant-')) return 'Should start with sk-ant-';
            return undefined;
          }
        });

        if (p.isCancel(key)) {
          p.cancel('Cancelled');
          process.exit(0);
        }

        process.env.ANTHROPIC_API_KEY = key as string;
        console.log('');
      }

      // Run full pipeline
      const discoveryResult = await runDiscovery();
      if (!discoveryResult) {
        process.exit(1);
      }

      console.log('');
      const toolsResult = await runToolSelection(discoveryResult);
      if (!toolsResult) {
        process.exit(1);
      }

      console.log('');
      const scaffoldResult = await runScaffold(discoveryResult, toolsResult);
      if (!scaffoldResult) {
        process.exit(1);
      }
    } catch (error) {
      handleError(error);
    }
  });

program.parse();

function generateClaudeCodeInstructions(): string {
  return `# SuperSkills — Claude Code Integration

When a user describes a business problem and wants to build an AI-native project, use SuperSkills.

## How It Works

1. **You do the EIID analysis** (no API key needed — you ARE Claude)
2. **SuperSkills scaffolds the project** via CLI

## EIID Framework

Every AI-native product works on four layers:

- **Enrichment**: Connect data sources, fill gaps, normalize formats
- **Inference**: Detect patterns, predict outcomes, flag anomalies
- **Interpretation**: Turn raw inference into actionable insights
- **Delivery**: Push insights where people are (email, Slack, WhatsApp, Telegram)

## Step-by-Step

1. Ask the user about their business problem
2. Analyze it through the EIID framework yourself
3. Create a discovery.json file with this structure:

\`\`\`json
{
  "projectName": "project-name",
  "context": {
    "forWhom": "client|my_company|me",
    "companyName": "...",
    "businessDescription": "...",
    "industry": "..."
  },
  "problem": "...",
  "desiredOutcome": "...",
  "currentProcess": ["step1", "step2"],
  "availableData": ["source1", "source2"],
  "strategicAnalysis": {
    "industryContext": "...",
    "valueMovement": "...",
    "currentPosition": "...",
    "targetPosition": "...",
    "opportunities": ["..."]
  },
  "eiidMapping": {
    "enrichment": {
      "existingData": ["..."],
      "missingData": ["..."],
      "sources": ["..."]
    },
    "inference": {
      "patterns": ["..."],
      "predictions": ["..."],
      "anomalies": ["..."]
    },
    "interpretation": {
      "insights": ["..."]
    },
    "delivery": {
      "channels": ["email", "slack"],
      "triggers": ["..."]
    }
  },
  "createdAt": "use current ISO 8601 date"
}
\`\`\`

4. Run scaffold:
\`\`\`bash
npx superskills scaffold --json --discovery discovery.json --output ./
\`\`\`

5. Follow the post-scaffold instructions (install deps, set up env vars, run init skills)
`;
}
