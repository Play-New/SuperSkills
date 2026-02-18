# SuperSkills

CLI that turns a business problem into a working AI-native project with five built-in skills.

## Prerequisites

- Node.js 20 or later (`node --version` to check)
- An Anthropic API key (only for CLI mode, not needed from Claude Code): [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

## Quick Start

Two ways to start:

**Option A: From the terminal**

```
npx superskills           # full pipeline: discovery → tools → scaffold
npx superskills init      # optional: saves API key so you don't paste it every time
```

**Option B: From Claude Code**

```
npx superskills init      # one-time: saves API key + writes instructions to ~/.claude/CLAUDE.md
```

Then open Claude Code and describe the business problem. Claude Code does the EIID analysis itself (no API key needed), creates `discovery.json`, calls `npx superskills scaffold --json --discovery discovery.json --output ./`.

Both paths produce the same project. The `tools` command is optional — use it only to review or override the auto-selected stack.

## The EIID Framework

Every AI-native product works on four layers:

- **Enrichment**: Connect data sources, fill gaps, normalize formats
- **Inference**: Detect patterns, predict outcomes, flag anomalies
- **Interpretation**: Turn raw inference into actionable insights
- **Delivery**: Push insights where people are (email, Slack, WhatsApp, Telegram), triggered by the right conditions

Discovery maps the business problem to these four layers. Every skill references this mapping when checking code.

## Project Structure

```
src/
  index.ts                       CLI entry (commander)
  discovery/
    index.ts                     Interactive UI (@clack/prompts)
    core.ts                      Validation pipeline
    analyze.ts                   Claude API calls + response validation
    schema.ts                    Zod schemas for input and output
    types.ts                     DiscoveryInput, DiscoveryResult, EIIDMapping
  catalog/
    index.ts                     selectTools(), loadCatalog()
    ui.ts                        Interactive tool selection
    types.ts                     Tool, ToolSuggestion, SelectionResult
  scaffold/
    index.ts                     scaffold(), createAgentTeamConfig()
    ui.ts                        Interactive scaffold UI
    types.ts                     ScaffoldInput, ScaffoldResult, AgentTeamConfig
    templates/
      claude-md.ts               CLAUDE.md for generated project
      claude-settings.ts         .claude/settings.json with hooks
      env-example.ts             .env.example from selected tools
      package-json.ts            package.json with pinned versions
      project-files.ts           Next.js, Inngest, Supabase, Playwright
      skill-agents.ts            Five .claude/agents/*.md subagent files
      skill-commands.ts          Ten .claude/skills/*/SKILL.md slash commands
      teammate-prompts.ts        Prompts for all five skills
standalone-agents/               Standalone skills for Claude Code (no scaffold needed)
  design/  trust/  testing/  efficiency/  strategy/
  (each has .claude/agents/ + .claude/skills/)
plugins/                         Cowork plugins for Claude Desktop
  design/  trust/  testing/  efficiency/  strategy/
  (each has .claude-plugin/plugin.json + commands/ + skills/)
test/
  analyze.test.ts                18 tests (API mocking, validation, markdown stripping)
  catalog.test.ts                24 tests (channel mapping, tool selection, categories)
  discovery-core.test.ts         10 tests (validation pipeline, error handling)
  scaffold.test.ts               23 tests (file generation, hooks, agents, skills, design tokens)
  schema.test.ts                 20 tests (Zod validation edge cases)
  fixtures/mock-discovery.json   Test fixture
tools-catalog.json               GDPR-verified tools with categories and EIID mapping
```

## Standalone Skills

Each skill also exists as a standalone package that works without the full pipeline. Two formats:

- **`standalone-agents/`** — for Claude Code. Copy `.claude/` into any project.
- **`plugins/`** — for Cowork (Claude Desktop). Install as a plugin.

All standalone skills include tool-specific best practices for Supabase, Vercel, Inngest, and Next.js.

## The Five Skills

Skills are checklists with teeth. They check code against specific criteria, report findings to CLAUDE.md, and in two cases (trust, testing) can block.

| Skill | What It Checks | Blocks? |
|-------|---------------|---------|
| **strategy** | EIID alignment, scope creep, proactive opportunity suggestions | No |
| **design** | shadcnblocks/shadcn hard rules, WCAG 2.1 AA, design tokens, responsive | No |
| **trust** | OWASP Top 10, GDPR, hardcoded secrets, injection, auth bypass | Yes |
| **efficiency** | Bundle size, Core Web Vitals, N+1 queries, API costs | No |
| **testing** | Test pass/fail, coverage gaps, critical flow verification | Yes (blocks stop) |

Skills activate via Claude Code hooks in `.claude/settings.json`:

```
SessionStart            first-run detection, suggests init skills
PreToolUse(Bash)        trust checks shell commands before execution
PostToolUse(Write|Edit) trust scans file changes after writing
Stop                    testing runs full suite, blocks if tests fail
```

Ten slash commands (five init, five review):

- `/strategy-init`, `/design-init`, `/trust-init`, `/efficiency-init`, `/testing-init`
- `/strategy-review`, `/design-review`, `/trust-audit`, `/efficiency-review`, `/testing-verify`

Five subagents in `.claude/agents/` for deep specialized checks.

## Tools Catalog

### Core (always selected)

| Tool | SDK | What It Does |
|------|-----|-------------|
| Supabase | `@supabase/supabase-js` | Database, auth, storage, pgvector |
| Vercel | -- | Hosting, edge functions |
| Inngest | `inngest` | Workflows, cron, retry |
| Claude | `@anthropic-ai/sdk` | LLM analysis |
| OpenAI | `openai` | Embeddings |

### Delivery (selected by channel from EIID mapping)

| Tool | Channels | SDK |
|------|----------|-----|
| Brevo | email, sms, whatsapp | `@getbrevo/brevo` |
| Telegram | telegram | `grammy` |
| Slack | slack | `@slack/bolt` |
| Discord | discord | `discord.js` |
| Baileys | whatsapp (dev, ban risk) | `@whiskeysockets/baileys` |

### Enrichment (selected by data sources)

| Tool | SDK | What It Does |
|------|-----|-------------|
| Apify | `apify-client` | Web scraping at scale |
| Supermemory | `@supermemory/ai-sdk` | Knowledge base connectors (Drive, Notion) |

### Testing (always selected)

| Tool | SDK | What It Does |
|------|-----|-------------|
| Playwright | `@playwright/test` | E2E tests, a11y audits, browser scraping |

Playwright has two roles: testing (primary) and browser-based scraping (secondary, for dev and sites you control). Apify handles production scraping at scale with proxy rotation.

## Development

```bash
npm install              # install dependencies
npm test                 # 95 tests across 5 files
npm run type-check       # TypeScript strict mode
npm run dev              # run CLI in dev mode (tsx)
npm run build            # compile to dist/
```

## Key Types

```typescript
interface DiscoveryResult {
  projectName: string;
  problem: string;
  desiredOutcome: string;
  context: Context;
  currentProcess: string[];
  availableData: string[];
  strategicAnalysis: StrategicAnalysis;
  eiidMapping: EIIDMapping;
  createdAt: string;
}

interface EIIDMapping {
  enrichment: { existingData: string[]; missingData: string[]; sources: string[] };
  inference: { patterns: string[]; predictions: string[]; anomalies: string[] };
  interpretation: { insights: string[] };
  delivery: { channels: string[]; triggers: string[] };
}

interface SelectionResult {
  core: ToolSuggestion[];
  delivery: ToolSuggestion[];
  enrichment: ToolSuggestion[];
  testing: ToolSuggestion[];
  all: ToolSuggestion[];
}
```

## Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | Asked interactively if missing |
| `SUPERSKILLS_MODEL` | No | `claude-opus-4-6` |

## Rules

1. Every skill appends findings to CLAUDE.md. That is the primary output.
2. Strategy appends architecture decisions to CLAUDE.md. Append-only.
3. Trust blocks on: credentials in code, injection, XSS, auth bypass, PII exposure.
4. Testing blocks task completion while tests fail.
5. Other skills flag issues but do not block.
6. All documentation in English.
