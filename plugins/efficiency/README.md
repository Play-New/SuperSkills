# Efficiency Plugin

Performance and cost optimization. Bundle size, Core Web Vitals, N+1 queries, API costs.

## Install

**Local testing**:

```bash
claude --plugin-dir ./plugins/efficiency
```

**From a marketplace**: `/plugin install efficiency@superskills`

**Cowork**: zip this folder and upload from the Cowork Plugins tab (click "+", drag zip, "Upload").

## Commands

| Command | What It Does |
|---------|-------------|
| `/efficiency:init` | Set performance budgets, configure bundle analysis. |
| `/efficiency:review` | Bundle size, Core Web Vitals, N+1 queries, cost report. |

## Skills

- **performance** (automatic): Flags performance issues when adding dependencies or writing queries. Advisory only.
