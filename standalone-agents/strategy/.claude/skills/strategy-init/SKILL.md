---
name: strategy-init
description: Validate EIID mapping, set priorities, write first decision to CLAUDE.md
---

# /strategy-init

Define the project's strategic context and priorities.

## Steps

1. Read CLAUDE.md and understand the current project context
2. If no strategic context exists, ask the user:
   - What problem does this project solve?
   - Who is it for?
   - What is the desired outcome?
   - What data sources are available?
   - What are the delivery channels (email, Slack, WhatsApp, etc.)?
3. Write the strategic context to CLAUDE.md
4. Ask the user to prioritize: what to build first
5. Write the first strategic decision to CLAUDE.md

## Output

Append to CLAUDE.md:

```markdown
### [Date] - Initial Strategy

**Context:** [Brief project description]
**Decision:** [What to build first]
**Consequences:** [What this means for development order]
```
