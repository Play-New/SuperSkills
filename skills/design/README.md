# Design Skill (Standalone)

Enforces shadcnblocks/shadcn usage, design tokens, WCAG 2.1 AA accessibility, and responsive design. Five hard rules, zero exceptions.

## Install

```bash
cp -r skills/design/.claude/ your-project/.claude/
```

Open the project in Claude Code. The commands work immediately.

## Commands

| Command | When | What It Does |
|---------|------|-------------|
| `/design-init` | Once | Sets up shadcn, shadcnblocks registry, design tokens, brand colors |
| `/design-review` | Any time | Audits UI against hard rules, a11y, responsive |

## Hard Rules

1. **shadcnblocks FIRST**: 1351 blocks across 90+ categories. If a block exists, use it.
2. **shadcn base SECOND**: Standard components for everything else.
3. **NEVER custom CSS classes**: No `.my-card`, no `.custom-header`.
4. **Global token file required**: All colors in CSS variables, Tailwind reads from them.
5. **Zero inline arbitrary values**: No `text-[#FF5733]`, no `p-[13px]`.

## Prerequisites

Works best with a Next.js + Tailwind project. If the project has a CLAUDE.md with an EIID mapping (from `/strategy-start`), design reviews will be more targeted.

## Subagent

The design subagent (`.claude/agents/design.md`) activates automatically when working on UI. Advisory only, does not block.
