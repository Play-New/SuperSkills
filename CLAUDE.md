# SuperSkills

Five autonomous skills for AI-native product development. Two use cases:

1. **Existing project.** Copy skills from `skills/` into any codebase. They work immediately as Claude Code slash commands.
2. **New project.** Run `superskills` to generate a full Next.js + Supabase project with all five skills configured.

## Project Structure

```
src/
  index.ts                       CLI entry (commander)
  discovery/                     Interactive EIID analysis
  catalog/                       Tool selection from GDPR-verified catalog
  scaffold/                      Project generation
    templates/                   All generated file templates
skills/                          Standalone skills (copy into any project)
  design/  trust/  testing/  efficiency/  strategy/
  settings.json                  Shared hooks for autonomous behavior
plugins/                         Claude Code / Cowork plugins
  design/  trust/  testing/  efficiency/  strategy/
test/                            98 tests across 5 files
```

## The EIID Framework

Four layers for AI-native products:

- **Enrichment**: Connect data sources, fill gaps, normalize formats
- **Inference**: Detect patterns, predict outcomes, flag anomalies
- **Interpretation**: Turn raw inference into actionable insights
- **Delivery**: Push insights where people are, triggered by the right conditions

Discovery maps the business problem to these layers. Every skill references this mapping.

## The Five Skills

| Skill | What It Checks | Blocks? |
|-------|---------------|---------|
| **strategy** | EIID alignment, scope creep, opportunity suggestions | No |
| **design** | shadcnblocks/shadcn hard rules, WCAG 2.1 AA, design tokens | No |
| **trust** | OWASP Top 10, GDPR, hardcoded secrets, injection, auth | Yes |
| **efficiency** | Bundle size, Core Web Vitals, N+1 queries, API costs | No |
| **testing** | Test pass/fail, coverage gaps, critical flow verification | Yes |

Slash commands: `/strategy-start`, `/strategy-init`, `/strategy-review`, `/design-init`, `/design-review`, `/trust-init`, `/trust-audit`, `/efficiency-init`, `/efficiency-review`, `/testing-init`, `/testing-verify`.

## Hooks

Skills activate via Claude Code hooks in `.claude/settings.json`:

- **PreToolUse(Bash)**: fast gate on dangerous commands
- **PostToolUse(Write|Edit)**: fast gate on security issues (credentials, injection)
- **Stop**: two agents. First: test verification (blocks if tests fail). Second: trust + strategy + design audit (writes to CLAUDE.md)

Scaffold generates project-specific hooks. Standalone skills share `skills/settings.json`.

## Development

```bash
npm install              # install dependencies
npm test                 # 98 tests across 5 files
npm run type-check       # TypeScript strict mode
npm run build            # compile to dist/
npm run check-sync       # verify skills/ and plugins/ match scaffold templates
```

## Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes (CLI only) | Asked interactively if missing |
| `SUPERSKILLS_MODEL` | No | `claude-opus-4-6` |

## Rules

1. Every skill appends findings to CLAUDE.md. That is the primary output.
2. Strategy appends architecture decisions. Append-only.
3. Trust blocks on: credentials in code, injection, XSS, auth bypass, PII exposure.
4. Testing blocks task completion while tests fail.
5. Other skills flag issues but do not block.
6. All documentation in English.
