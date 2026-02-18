import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { scaffold } from '../src/scaffold/index.js';
import type { DiscoveryResult } from '../src/discovery/types.js';
import { selectTools } from '../src/catalog/index.js';

const mockDiscovery: DiscoveryResult = {
  projectName: 'Test Project',
  problem: 'Test problem',
  desiredOutcome: 'Test outcome',
  context: {
    forWhom: 'me',
    businessDescription: 'Test business',
    industry: 'Tech'
  },
  currentProcess: ['Manual step 1', 'Manual step 2'],
  availableData: ['Data source 1', 'Data source 2'],
  strategicAnalysis: {
    industryContext: 'Tech industry context',
    valueMovement: 'Value moving to AI',
    currentPosition: 'Current state',
    targetPosition: 'Target state',
    opportunities: ['Opportunity 1', 'Opportunity 2']
  },
  eiidMapping: {
    enrichment: {
      existingData: ['Existing 1'],
      missingData: ['Missing 1'],
      sources: ['Source 1']
    },
    inference: {
      patterns: ['Pattern 1'],
      predictions: ['Prediction 1'],
      anomalies: ['Anomaly 1']
    },
    interpretation: {
      insights: ['Insight 1']
    },
    delivery: {
      channels: ['email'],
      triggers: ['Trigger 1']
    }
  },
  createdAt: new Date().toISOString()
};

const testOutputDir = path.join(process.cwd(), 'test', 'output');

describe('scaffold', () => {
  beforeEach(async () => {
    await fs.ensureDir(testOutputDir);
  });

  afterEach(async () => {
    await fs.remove(testOutputDir);
  });

  it('creates project directory with slugified name', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    expect(result.projectPath).toContain('test-project');
    expect(await fs.pathExists(result.projectPath)).toBe(true);
  });

  it('generates CLAUDE.md with project context and skills section', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const claudeMd = await fs.readFile(
      path.join(result.projectPath, 'CLAUDE.md'),
      'utf-8'
    );

    expect(claudeMd).toContain('Test Project');
    expect(claudeMd).toContain('Test problem');
    expect(claudeMd).toContain('EIID');
    expect(claudeMd).toContain('SuperSkills');
    expect(claudeMd).toContain('/strategy-init');
    expect(claudeMd).toContain('/design-init');
    expect(claudeMd).toContain('/testing-verify');
  });

  it('generates .claude/settings.json with real hooks', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const settings = await fs.readJSON(
      path.join(result.projectPath, '.claude', 'settings.json')
    );

    expect(settings.hooks).toBeDefined();
    expect(settings.hooks.SessionStart).toBeDefined();
    expect(settings.hooks.PreToolUse).toBeDefined();
    expect(settings.hooks.PostToolUse).toBeDefined();
    expect(settings.hooks.Stop).toBeDefined();
    // No fabricated agentTeam key
    expect(settings.agentTeam).toBeUndefined();
  });

  it('configures trust hooks for security scanning', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const settings = await fs.readJSON(
      path.join(result.projectPath, '.claude', 'settings.json')
    );

    // PreToolUse should have Bash matcher for security
    const preToolUse = settings.hooks.PreToolUse;
    expect(preToolUse.length).toBeGreaterThan(0);
    expect(preToolUse[0].matcher).toBe('Bash');

    // PostToolUse should have Write|Edit matcher
    const postToolUse = settings.hooks.PostToolUse;
    expect(postToolUse.length).toBeGreaterThan(0);
    expect(postToolUse[0].matcher).toBe('Write|Edit');
  });

  it('generates 5 subagent files in .claude/agents/', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const agentNames = ['strategy', 'design', 'trust', 'efficiency', 'testing'];
    for (const name of agentNames) {
      const agentPath = path.join(result.projectPath, '.claude', 'agents', `${name}.md`);
      expect(await fs.pathExists(agentPath)).toBe(true);

      const content = await fs.readFile(agentPath, 'utf-8');
      expect(content).toContain('---'); // has frontmatter
      expect(content).toContain('CLAUDE.md'); // reminder to update CLAUDE.md
    }
  });

  it('generates 10 skill directories in .claude/skills/', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const skillNames = [
      'strategy-init', 'design-init', 'trust-init', 'efficiency-init', 'testing-init',
      'strategy-review', 'design-review', 'trust-audit', 'efficiency-review', 'testing-verify'
    ];

    for (const name of skillNames) {
      const skillPath = path.join(result.projectPath, '.claude', 'skills', name, 'SKILL.md');
      expect(await fs.pathExists(skillPath)).toBe(true);
    }
  });

  it('generates first-run hook script', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const hookPath = path.join(result.projectPath, '.claude', 'hooks', 'first-run-check.sh');
    expect(await fs.pathExists(hookPath)).toBe(true);

    const content = await fs.readFile(hookPath, 'utf-8');
    expect(content).toContain('#!/bin/bash');
    expect(content).toContain('node_modules');
    expect(content).toContain('.env.local');
  });

  it('generates package.json with selected dependencies', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const packageJson = await fs.readJSON(
      path.join(result.projectPath, 'package.json')
    );

    expect(packageJson.name).toBe('test-project');
    expect(packageJson.dependencies.next).toBeDefined();
    expect(packageJson.dependencies['@supabase/supabase-js']).toBeDefined();
  });

  it('generates .env.example with required variables', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const envExample = await fs.readFile(
      path.join(result.projectPath, '.env.example'),
      'utf-8'
    );

    expect(envExample).toContain('SUPABASE_URL');
    expect(envExample).toContain('ANTHROPIC_API_KEY');
  });

  it('returns list of created files including agents and skills', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    expect(result.filesCreated).toContain('CLAUDE.md');
    expect(result.filesCreated).toContain('.env.example');
    expect(result.filesCreated).toContain('.claude/settings.json');
    expect(result.filesCreated).toContain('package.json');
    expect(result.filesCreated).toContain('src/app/layout.tsx');
    expect(result.filesCreated).toContain('.claude/agents/strategy.md');
    expect(result.filesCreated).toContain('.claude/agents/testing.md');
    expect(result.filesCreated).toContain('.claude/hooks/first-run-check.sh');
    expect(result.filesCreated.some(f => f.includes('.claude/skills/'))).toBe(true);
  });

  it('returns agent team configuration with 5 skills', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    expect(result.agentTeam.skills).toHaveLength(5);
    const names = result.agentTeam.skills.map(s => s.name);
    expect(names).toContain('strategy');
    expect(names).toContain('design');
    expect(names).toContain('trust');
    expect(names).toContain('efficiency');
    expect(names).toContain('testing');
  });

  it('generates Next.js project structure', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    expect(await fs.pathExists(path.join(result.projectPath, 'src/app/layout.tsx'))).toBe(true);
    expect(await fs.pathExists(path.join(result.projectPath, 'src/app/page.tsx'))).toBe(true);
    expect(await fs.pathExists(path.join(result.projectPath, 'src/app/globals.css'))).toBe(true);
    expect(await fs.pathExists(path.join(result.projectPath, 'tailwind.config.ts'))).toBe(true);
  });

  it('generates Inngest workflow structure', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    expect(await fs.pathExists(path.join(result.projectPath, 'src/inngest/client.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(result.projectPath, 'src/inngest/functions/analyze.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(result.projectPath, 'src/app/api/inngest/route.ts'))).toBe(true);
  });

  it('generates Supabase setup', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    expect(await fs.pathExists(path.join(result.projectPath, 'src/lib/supabase.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(result.projectPath, 'supabase/config.toml'))).toBe(true);
  });

  it('generates correct deliverViaBrevo function name', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const deliveryFile = await fs.readFile(
      path.join(result.projectPath, 'src/lib/delivery/index.ts'),
      'utf-8'
    );

    expect(deliveryFile).toContain('deliverViaBrevo');
    expect(deliveryFile).not.toContain('deliverViaBravo');
  });

  it('generates components.json with shadcnblocks registry', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const componentsJson = await fs.readJSON(
      path.join(result.projectPath, 'components.json')
    );

    expect(componentsJson.$schema).toBe('https://ui.shadcn.com/schema.json');
    expect(componentsJson.registries).toBeDefined();
    expect(componentsJson.registries['@shadcnblocks']).toBeDefined();
    expect(componentsJson.registries['@shadcnblocks'].url).toBe('https://shadcnblocks.com/r');
  });

  it('generates globals.css with CSS custom properties', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const globalsCss = await fs.readFile(
      path.join(result.projectPath, 'src/app/globals.css'),
      'utf-8'
    );

    // Must have design tokens as CSS custom properties
    expect(globalsCss).toContain('--background:');
    expect(globalsCss).toContain('--foreground:');
    expect(globalsCss).toContain('--primary:');
    expect(globalsCss).toContain('--primary-foreground:');
    expect(globalsCss).toContain('--muted:');
    expect(globalsCss).toContain('--border:');
    expect(globalsCss).toContain('--radius:');
    // Must have dark mode variant
    expect(globalsCss).toContain('.dark');
    // Must apply base styles
    expect(globalsCss).toContain('border-border');
    expect(globalsCss).toContain('bg-background');
    expect(globalsCss).toContain('text-foreground');
  });

  it('generates tailwind.config.ts that extends from CSS variables', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const tailwindConfig = await fs.readFile(
      path.join(result.projectPath, 'tailwind.config.ts'),
      'utf-8'
    );

    // Must reference CSS variables, not hardcoded colors
    expect(tailwindConfig).toContain('hsl(var(--primary))');
    expect(tailwindConfig).toContain('hsl(var(--background))');
    expect(tailwindConfig).toContain('hsl(var(--border))');
    expect(tailwindConfig).toContain('var(--radius)');
  });

  it('generates cn() utility in src/lib/utils.ts', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const utilsFile = await fs.readFile(
      path.join(result.projectPath, 'src/lib/utils.ts'),
      'utf-8'
    );

    expect(utilsFile).toContain('clsx');
    expect(utilsFile).toContain('twMerge');
    expect(utilsFile).toContain('export function cn');
  });

  it('includes clsx and tailwind-merge in package.json', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const packageJson = await fs.readJSON(
      path.join(result.projectPath, 'package.json')
    );

    expect(packageJson.dependencies.clsx).toBeDefined();
    expect(packageJson.dependencies['tailwind-merge']).toBeDefined();
  });

  it('includes SHADCNBLOCKS_API_KEY in .env.example', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const envExample = await fs.readFile(
      path.join(result.projectPath, '.env.example'),
      'utf-8'
    );

    expect(envExample).toContain('SHADCNBLOCKS_API_KEY');
  });

  it('generates home page with semantic Tailwind classes', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    const homePage = await fs.readFile(
      path.join(result.projectPath, 'src/app/page.tsx'),
      'utf-8'
    );

    // Must use semantic classes, not hardcoded grays
    expect(homePage).toContain('text-muted-foreground');
    expect(homePage).toContain('bg-card');
    expect(homePage).not.toContain('text-gray-');
  });

  it('generates Playwright config and sample E2E test', async () => {
    const tools = await selectTools(mockDiscovery);
    const result = await scaffold(
      { discovery: mockDiscovery, tools },
      { outputDir: testOutputDir }
    );

    expect(await fs.pathExists(path.join(result.projectPath, 'playwright.config.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(result.projectPath, 'tests/e2e/smoke.spec.ts'))).toBe(true);

    const playwrightConfig = await fs.readFile(
      path.join(result.projectPath, 'playwright.config.ts'),
      'utf-8'
    );
    expect(playwrightConfig).toContain('defineConfig');
    expect(playwrightConfig).toContain('localhost:3000');
  });
});
