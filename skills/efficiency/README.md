# Efficiency Skill (Standalone)

Performance and cost optimization. Bundle analysis, Core Web Vitals, N+1 query detection, API cost estimation. Includes optimization patterns for Supabase, Vercel, Inngest, and Next.js.

## Install

```bash
cp -r skills/efficiency/.claude/ your-project/.claude/
```

Open the project in Claude Code. The commands work immediately.

## Commands

| Command | When | What It Does |
|---------|------|-------------|
| `/efficiency-init` | Once | Sets performance budgets, configures bundle analysis |
| `/efficiency-review` | Any time | Bundle size, Core Web Vitals, N+1 queries, cost report |

## Thresholds

- Bundle > 200KB gzipped: critical
- LCP > 2.5s: warning
- N+1 queries: always flagged
- API costs: estimated monthly

## Prerequisites

Works with any project. Most useful with Next.js. If the project has a CLAUDE.md with an EIID mapping (from `/strategy-start`), cost estimates include delivery channel costs.

## Subagent

The efficiency subagent (`.claude/agents/efficiency.md`) activates automatically when adding dependencies or writing queries. Advisory only, does not block.
