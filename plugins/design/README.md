# Design Plugin

Enforces shadcnblocks/shadcn usage, design tokens, WCAG 2.1 AA accessibility, and responsive design.

## Install

**Local testing**:

```bash
claude --plugin-dir ./plugins/design
```

**From a marketplace**: `/plugin install design@superskills`

**Cowork**: zip this folder and upload from the Cowork Plugins tab (click "+", drag zip, "Upload").

## Commands

| Command | What It Does |
|---------|-------------|
| `/design:init` | Set up shadcn, shadcnblocks registry, design tokens, brand colors. |
| `/design:review` | Audit UI against five hard rules, a11y, responsive. |

## Skills

- **design-system** (automatic): Enforces shadcnblocks/shadcn rules when working on UI. Advisory only.
