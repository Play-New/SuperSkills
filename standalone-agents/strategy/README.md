# Strategy Skill (Standalone)

Strategic alignment and opportunity scanning for any project. This is the recommended entry point: it defines the project, maps it to the EIID framework, and writes CLAUDE.md.

## Install

Copy into your project:

```bash
cp -r standalone-agents/strategy/.claude/ your-project/.claude/
```

Open the project in Claude Code. The commands work immediately.

## Commands

| Command | When | What It Does |
|---------|------|-------------|
| `/strategy-start` | First time | Conversational: understands the business, maps EIID, writes CLAUDE.md |
| `/strategy-init` | After CLAUDE.md exists | Validates EIID mapping, sets priorities, writes first decision |
| `/strategy-review` | Any time | Alignment check + proactive opportunity scan |

Start with `/strategy-start` if the project has no CLAUDE.md or no EIID mapping.

## What EIID Means

Four layers every AI-native product needs:

- **Enrichment**: connect data sources, fill gaps
- **Inference**: detect patterns, predict outcomes
- **Interpretation**: turn inference into actionable insights
- **Delivery**: push insights where people are (email, Slack, WhatsApp)

`/strategy-start` maps your business problem to these four layers. Every other skill references this mapping.

## After Strategy

Once CLAUDE.md has the EIID mapping, install other skills as needed:

- UI work? Copy `standalone-agents/design/.claude/` and run `/design-init`
- User data? Copy `standalone-agents/trust/.claude/` and run `/trust-init`
- Need tests? Copy `standalone-agents/testing/.claude/` and run `/testing-init`
- Performance concerns? Copy `standalone-agents/efficiency/.claude/` and run `/efficiency-init`

## Subagent

The strategy subagent (`.claude/agents/strategy.md`) activates automatically after commits. It checks alignment and suggests opportunities across all four EIID layers. Advisory only, does not block.
