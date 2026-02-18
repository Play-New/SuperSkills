# Strategy Plugin

Strategic alignment and opportunity scanning. Defines projects, maps business problems to the EIID framework, and checks ongoing alignment.

## Install

**Local testing** (load without installing):

```bash
claude --plugin-dir ./plugins/strategy
```

**From a marketplace** (after SuperSkills is published):

```
/plugin install strategy@superskills
```

**Cowork**: zip this folder and upload it from the Cowork Plugins tab (click "+", drag the zip, click "Upload").

## Commands

| Command | What It Does |
|---------|-------------|
| `/strategy:start` | Define a project from scratch. Maps business problem to EIID, writes CLAUDE.md. |
| `/strategy:init` | Validate existing EIID mapping and set priorities. |
| `/strategy:review` | Alignment check + proactive opportunity scan. |

Start with `/strategy:start` if the project has no CLAUDE.md.

## Skills

- **alignment** (automatic): Checks strategic alignment after code changes. Advisory only.
