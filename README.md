```
   ____                       ____  __   _ ____
  / ___| _   _ _ __   ___ _ _/ ___|| | _(_) | |___
  \___ \| | | | '_ \ / _ \ '__\___ \| |/ / | | / __|
   ___) | |_| | |_) |  __/ |  ___) |   <| | | \__ \
  |____/ \__,_| .__/ \___|_| |____/|_|\_\_|_|_|___/
              |_|
```

Business problem in, working project out.

A CLI that turns a business problem into a working AI-native project. You describe the problem. SuperSkills figures out the data sources, the delivery channels, the tool stack, and the project structure. Then it generates everything, including five skills that keep checking your code as you build.

## What AI-native means

Every component in a value chain evolves from custom-built to commodity. Databases took two decades. Data processing is getting there now: what cost a team of analysts three weeks takes a model seconds and a few cents.

When processing becomes a commodity, the edge moves to what happens after the analysis. A B2B distributor has orders in Gmail, inventory in the ERP, supplier lead times on a portal. Anyone can process this data. The edge is in connecting those sources, detecting that a supplier's lead times increased 40% over six weeks, and getting that finding to the procurement manager before she places the next order.

Most software stops at analysis and produces a dashboard. The ops manager checks it Monday. The delayed shipment happened Friday. An AI-native product completes the chain: connect the data, run the analysis, decide what matters, deliver the result before the window closes.

SuperSkills structures every project around four layers that map this chain:

| Layer | What it does |
|-------|-------------|
| **E**nrichment | Connect and normalize data from scattered sources (Gmail, ERP, APIs, portals) |
| **I**nference | Detect patterns, predict outcomes, flag anomalies |
| **I**nterpretation | Decide what matters and how to frame it for the human |
| **D**elivery | Push insights where people are, triggered by the right conditions |

This is **EIID**. Discovery maps your business problem to these four layers. Every skill checks your code against this mapping.

```
  describe problem ──> discovery ──> tools ──> scaffold ──> working project
       you              EIID        auto       auto         Next.js + Supabase
                       analysis    selected   generated     + 5 autonomous skills
```

## Prerequisites

- **Node.js 20 or later.** Check with `node --version`. If you need to install or update: [nodejs.org](https://nodejs.org)
- **An Anthropic API key** (only for CLI mode). Get one at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys). Free tier available. Not needed if you use SuperSkills from Claude Code.

That is all you need to get started. The rest (Supabase, Vercel, etc.) comes later when you set up the generated project.

## Install

```bash
npm install -g superskills
```

Or run without installing:

```bash
npx superskills
```

## Quick Start

Two ways to start. Pick the one that fits how you work.

### Option A: From the terminal

One command. It asks about your business problem, analyzes it, picks tools, and generates the project.

```bash
npx superskills
```

If you don't have an API key set, it asks for one and tells you where to get it. Everything is guided step by step.

Optional one-time setup (saves your API key so you don't paste it every time):

```bash
npx superskills init
```

### Option B: From Claude Code

No Anthropic API key needed. Claude Code IS Claude — it does the EIID analysis itself. SuperSkills only handles scaffolding.

One-time setup:

```bash
npx superskills init
```

This saves your API key and writes instructions to `~/.claude/CLAUDE.md` so Claude Code knows how to use SuperSkills.

After that, open Claude Code and describe your business problem. Claude Code will:

1. Analyze it through the EIID framework (no API call needed)
2. Create a `discovery.json` with the analysis
3. Call `npx superskills scaffold --json --discovery discovery.json --output ./`
4. Follow the post-scaffold instructions

### After scaffold

Both paths produce the same project. Scaffold prints exact next steps:

```bash
cd your-project
npm install
cp .env.example .env.local
# Fill in the keys (scaffold tells you where to get each one)
npx supabase start     # needs Docker
npm run dev
```

Then open the project in Claude Code and run the init skills:

```
/strategy-start     Defines the project, maps EIID, writes CLAUDE.md (if not done yet)
/strategy-init      Validates the EIID mapping, sets priorities
/design-init        Asks for brand, configures shadcnblocks + shadcn + tokens
/trust-init         Sets up auth, RLS policies, CORS
/efficiency-init    Sets performance budgets
/testing-init       Configures vitest + Playwright, writes first smoke test
```

These run once. After that, hooks handle ongoing checks automatically.

## Use a Single Skill (no scaffold needed)

Don't need the full pipeline? Each skill works standalone. Pick one and add it to any existing project. No API key, no discovery, no scaffold.

### For Claude Code

```bash
# Clone the repo (once)
git clone https://github.com/Play-New/superskills.git

# Copy the skill you need into your project
cp -r superskills/standalone-agents/design/.claude/ your-project/.claude/
```

You can copy multiple skills — the `.claude/` folders merge:

```bash
cp -r superskills/standalone-agents/design/.claude/ your-project/.claude/
cp -r superskills/standalone-agents/trust/.claude/ your-project/.claude/
```

Open the project in Claude Code. The slash commands work immediately:

```
/design-init      Set up shadcn + shadcnblocks + design tokens
/design-review    Audit UI, a11y, responsive
```

Each skill folder has a README.md with installation and usage instructions.

### As Claude Code Plugins

Each skill is also a Claude Code plugin. Plugins use namespaced commands (`/strategy:start` instead of `/strategy-start`).

**Local testing** (load without installing):

```bash
claude --plugin-dir superskills/plugins/strategy
```

**From a marketplace** (after SuperSkills is published):

```
/plugin install strategy@superskills
```

**Cowork** (Claude's desktop knowledge work mode): zip the plugin folder and upload it from the Cowork Plugins tab (click "+", drag the zip, "Upload"). Or install from the marketplace at [claude.com/plugins](https://claude.com/plugins).

```bash
# Example: create a zip for the strategy plugin
cd plugins && zip -r strategy.zip strategy/ && cd ..
# Then drag strategy.zip into Cowork's Plugins tab
```

### Available Skills

| Skill | What It Does | Standalone Commands | Plugin Commands |
|-------|-------------|-------------------|----------------|
| **strategy** | Project definition, alignment, opportunity scan | `/strategy-start`, `-init`, `-review` | `/strategy:start`, `:init`, `:review` |
| **design** | shadcnblocks/shadcn, design tokens, WCAG 2.1 AA | `/design-init`, `-review` | `/design:init`, `:review` |
| **trust** | OWASP Top 10, GDPR, secrets, auth, RLS | `/trust-init`, `-audit` | `/trust:init`, `:audit` |
| **testing** | vitest + Playwright, test verification | `/testing-init`, `-verify` | `/testing:init`, `:verify` |
| **efficiency** | Bundle size, CWV, N+1 queries, API costs | `/efficiency-init`, `-review` | `/efficiency:init`, `:review` |

All skills include tool-specific best practices for Supabase, Vercel, Inngest, and Next.js.

## EIID in practice

Same distributor, layer by layer.

**Enrichment.** Orders arrive as PDF, Excel, and plain text. The ERP uses SKU codes that don't match the supplier portal. Enrichment normalizes everything into one schema and links the IDs.

**Inference.** One supplier's lead time went from 5 days to 8 over six weeks. DACH orders dropped 12% month-over-month. A pricing anomaly shows the same SKU costing 15% more through one channel. None of these are visible in a single source.

**Interpretation.** The lead time increase matters: that supplier handles 30% of high-margin orders. The DACH drop matches last year's seasonal pattern. The pricing anomaly affects $40K/month. Supplier risk first, pricing second, DACH deprioritized.

**Delivery.** Procurement manager gets a Slack message Tuesday morning with the supplier risk and a suggested reallocation. CFO gets a weekly email on the pricing anomaly. Regional manager gets nothing about DACH because it's seasonal noise.

## What Gets Generated

Given a business problem, scaffold produces a Next.js project with:

- **CLAUDE.md** containing the strategic brief and EIID mapping
- **Five subagents** in `.claude/agents/` that run specialized checks
- **Eleven slash commands** in `.claude/skills/` (one entry point, five for initial setup, five for ongoing review)
- **Claude Code hooks** in `.claude/settings.json` that trigger security and test checks automatically
- **A first-run script** that detects when the project is opened for the first time and suggests what to do
- **Next.js + Supabase + Inngest** application structure with delivery integrations
- **Playwright and vitest** configured for E2E and unit testing

## The Five Skills

Skills are checklists with teeth. They check code against specific criteria, report findings to CLAUDE.md, and in two cases can block.

| Skill | What It Checks | Blocks? |
|-------|---------------|---------|
| **strategy** | EIID alignment, scope creep, proactive opportunity suggestions | No |
| **design** | shadcnblocks/shadcn usage, WCAG 2.1 AA, design tokens, responsive | No |
| **trust** | OWASP Top 10, GDPR, hardcoded secrets, injection, auth bypass | Yes |
| **efficiency** | Bundle size, Core Web Vitals, N+1 queries, API costs | No |
| **testing** | Test pass/fail, coverage gaps, critical flow verification | Yes (blocks stop) |

### How They Run

**Automatically via hooks** (configured in `.claude/settings.json`):

Fast gates during work, full audit at the end. Zero overhead while building. One comprehensive report before stopping.

| When | What Happens |
|------|-------------|
| Session starts | Detects first run (missing node_modules, .env.local). Suggests init skills. |
| Before a shell command runs | Fast gate on dangerous commands (credentials, rm -rf, injection). |
| After a file is written or edited | Fast gate on obvious security issues (hardcoded secrets, injection). |
| Before stopping | Full audit agent runs four checks: tests, trust deep scan, strategy alignment, design rules. Writes all findings to CLAUDE.md. Blocks if tests fail. |

**On demand via slash commands:**

```
/strategy-start     Define project, map EIID, write CLAUDE.md (entry point)
/strategy-review    EIID alignment + proactive opportunity scan
/design-review      Audit shadcnblocks/shadcn usage, hard rules, a11y, tokens
/trust-audit        OWASP Top 10 + GDPR checklist
/efficiency-review  Bundle size, CWV, N+1 queries, cost report
/testing-verify     Run full test suite, report failures
```

## Tool Stack

SuperSkills picks tools based on the delivery channels and data sources in your EIID mapping. All tools are GDPR-verified.

### Core (always included)

| Tool | What It Does |
|------|-------------|
| **Supabase** | Database, auth, storage, pgvector for embeddings |
| **Vercel** | Hosting, edge functions |
| **Inngest** | Durable workflows, cron jobs, retry logic |
| **Claude** | LLM for analysis and inference |
| **OpenAI** | Embeddings |

### Delivery (based on channels)

| Tool | When Selected |
|------|--------------|
| **Brevo** | Email, SMS, or WhatsApp delivery |
| **Telegram** | Telegram delivery |
| **Slack** | Slack delivery |
| **Discord** | Discord delivery |
| **Baileys** | WhatsApp in development (unofficial, ban risk) |

### Enrichment (based on data sources)

| Tool | When Selected |
|------|--------------|
| **Apify** | Web scraping at scale (proxy management, rate limiting) |
| **Supermemory** | Knowledge base connectors (Google Drive, Notion, OneDrive) |
| **Playwright** | Browser-based scraping for dev and sites you control |

### Testing (always included)

| Tool | What It Does |
|------|-------------|
| **Playwright** | E2E browser tests, accessibility audits, visual regression |

Playwright has two roles: testing (primary) and browser-based scraping (secondary). For production scraping at scale, Apify handles proxy rotation and cloud execution.

If you want to review or change the auto-selected tools before scaffolding:

```bash
superskills tools
```

Print the full catalog:

```bash
superskills tools --catalog
```

## Pipeline Mode

For automation and CI, pass JSON files instead of answering prompts:

```bash
superskills discovery --json --input brief.json --output discovery.json
superskills scaffold --json --discovery discovery.json --output ./my-project
```

If you need to override tools in pipeline mode:

```bash
superskills tools --json --input discovery.json --output tools.json
superskills scaffold --json --discovery discovery.json --tools tools.json --output ./my-project
```

### Input Format

The discovery command accepts a JSON brief:

```json
{
  "projectName": "order-automation",
  "context": {
    "forWhom": "client",
    "companyName": "Acme Corp",
    "businessDescription": "B2B hardware distribution, 200 employees",
    "industry": "manufacturing"
  },
  "problem": "4 hours per day spent on manual order processing from email to ERP",
  "desiredOutcome": "Automated order intake with anomaly detection",
  "currentProcess": ["Check email for orders", "Copy data to Excel", "Enter into ERP"],
  "availableData": ["Gmail", "ERP API", "Supplier portal"]
}
```

Print the full JSON Schema with `superskills discovery --schema`.

## Development

### Setup

```bash
git clone https://github.com/Play-New/superskills.git
cd superskills
npm install
```

### Commands

```bash
npm test              # 98 tests across 5 files
npm run type-check    # TypeScript strict mode
npm run dev           # Run CLI in development mode
npm run build         # Compile to dist/
npm run lint          # ESLint
```

### Environment

| Variable | Required | Default |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes (for discovery) | Asked interactively if missing |
| `SUPERSKILLS_MODEL` | No | `claude-opus-4-6` |

### Tests

98 tests across five files:

| File | Count | What It Tests |
|------|-------|--------------|
| `analyze.test.ts` | 18 | Claude API mocking, JSON validation, markdown stripping |
| `catalog.test.ts` | 24 | Channel mapping, tool selection, category handling |
| `discovery-core.test.ts` | 10 | Validation pipeline, error transformation |
| `scaffold.test.ts` | 26 | File generation, hooks, agents, skills, design tokens, Playwright, E2E |
| `schema.test.ts` | 20 | Zod validation edge cases, defaults, JSON Schema output |

## Conceptual References

Three ideas shaped the design.

**Value mapping** (Simon Wardley). Wardley Maps position each component on an evolution axis from genesis to commodity. Discovery uses this to assess which parts of a business process are ready for automation and which still need human judgment. A component at commodity stage (e.g., data storage) gets automated. One at genesis (e.g., a novel scoring model) gets flagged for human oversight.

**Value movement in the AI era** (Sangeet Paul Choudary, *Reshuffle*). Choudary documents how AI commoditizes processing and pushes value toward orchestration and delivery. When any company can run the same model on the same data, the differentiator becomes what happens after the analysis: which findings reach which person, through which channel, triggered by which conditions. EIID ends with Delivery as a distinct layer because that is where the value concentrates.

**Intelligence where the user is** (Peter Steinberger). Steinberger's work on OpenClaw and CLI-first development shows that tools integrated into existing workflows get adopted, while tools that require context-switching get ignored. SuperSkills generates Claude Code hooks and slash commands that run inside the editor. The developer never leaves the terminal.

## License

MIT
