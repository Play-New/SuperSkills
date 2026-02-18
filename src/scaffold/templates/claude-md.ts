import type { DiscoveryResult } from '../../discovery/types.js';
import type { SelectionResult } from '../../catalog/types.js';

export function generateClaudeMd(discovery: DiscoveryResult, tools: SelectionResult): string {
  const contextSection = generateContextSection(discovery);
  const strategicSection = generateStrategicSection(discovery);
  const eiidSection = generateEiidSection(discovery);
  const toolsSection = generateToolsSection(tools);
  const architectureSection = generateArchitectureSection();
  const skillsSection = generateSkillsSection();

  return `# ${discovery.projectName}

${contextSection}

${strategicSection}

${eiidSection}

${toolsSection}

${architectureSection}

${skillsSection}

---

## Changelog

<!-- strategy skill appends decisions here -->

### ${new Date().toISOString().split('T')[0]} - Project Created

- Initial setup via SuperSkills
- EIID mapping defined
- Skills configured
`;
}

function generateContextSection(discovery: DiscoveryResult): string {
  const ctx = discovery.context;
  let section = `## Context\n\n`;

  if (ctx.forWhom === 'client') {
    section += `**Client:** ${ctx.companyName || 'Not specified'}\n`;
  } else if (ctx.forWhom === 'my_company') {
    section += `**Company:** ${ctx.companyName || 'Own company'}\n`;
  } else {
    section += `**For:** Personal/freelance project\n`;
  }

  section += `**Business:** ${ctx.businessDescription}\n`;
  if (ctx.industry) section += `**Industry:** ${ctx.industry}\n`;
  if (ctx.employees) section += `**Size:** ${ctx.employees} employees\n`;
  if (ctx.revenue) section += `**Revenue:** ${ctx.revenue}\n`;

  return section;
}

function generateStrategicSection(discovery: DiscoveryResult): string {
  const sa = discovery.strategicAnalysis;
  return `## Strategic Analysis

### Problem

${discovery.problem}

### Desired Outcome

${discovery.desiredOutcome}

### Industry Context

${sa.industryContext}

### Value Movement

${sa.valueMovement}

### Current Position

${sa.currentPosition}

### Target Position

${sa.targetPosition}

### Opportunities

${sa.opportunities.map(o => `- ${o}`).join('\n')}
`;
}

function generateEiidSection(discovery: DiscoveryResult): string {
  const eiid = discovery.eiidMapping;
  return `## AI-Native Architecture (EIID)

### Enrichment

**Existing Data:**
${eiid.enrichment.existingData.map(d => `- ${d}`).join('\n')}

**Missing Data:**
${eiid.enrichment.missingData.map(d => `- ${d}`).join('\n')}

**Sources:**
${eiid.enrichment.sources.map(s => `- ${s}`).join('\n')}

### Inference

**Patterns to Detect:**
${eiid.inference.patterns.map(p => `- ${p}`).join('\n')}

**Predictions:**
${eiid.inference.predictions.map(p => `- ${p}`).join('\n')}

**Anomalies:**
${eiid.inference.anomalies.map(a => `- ${a}`).join('\n')}

### Interpretation

**Insights to Generate:**
${eiid.interpretation.insights.map(i => `- ${i}`).join('\n')}

### Delivery

**Channels:**
${eiid.delivery.channels.map(c => `- ${c}`).join('\n')}

**Triggers:**
${eiid.delivery.triggers.map(t => `- ${t}`).join('\n')}
`;
}

function generateToolsSection(tools: SelectionResult): string {
  const coreTools = tools.core.map(t => `- **${t.tool.name}**: ${t.tool.description}`).join('\n');
  const deliveryTools = tools.delivery.map(t => `- **${t.tool.name}**: ${t.reason}`).join('\n');
  const enrichmentTools = tools.enrichment.map(t => `- **${t.tool.name}**: ${t.reason}`).join('\n');
  const testingTools = tools.testing.map(t => `- **${t.tool.name}**: ${t.reason}`).join('\n');

  return `## Tools Stack

### Core

${coreTools}

### Delivery

${deliveryTools || '- None selected'}

### Enrichment

${enrichmentTools || '- None selected'}

### Testing

${testingTools || '- None selected'}
`;
}

function generateArchitectureSection(): string {
  return `## Architecture Decisions

<!-- strategy skill appends decisions here in format: -->
<!-- ### YYYY-MM-DD - Decision Title -->
<!-- **Context:** Why this decision was needed -->
<!-- **Decision:** What was decided -->
<!-- **Consequences:** What this means for the project -->
`;
}

function generateSkillsSection(): string {
  return `## SuperSkills

Five skills amplify this project. Skills are competencies, not agents.

### Init Skills (run once after scaffold)

| Skill | Purpose |
|-------|---------|
| \`/strategy-init\` | Validate EIID mapping, set priorities |
| \`/design-init\` | Configure brand, shadcn, design tokens |
| \`/trust-init\` | Set up auth, RLS, CORS, data sensitivity |
| \`/efficiency-init\` | Set performance budgets, bundle analysis |
| \`/testing-init\` | Set up vitest + Playwright, first smoke test |

### Review Skills (run any time)

| Skill | Purpose |
|-------|---------|
| \`/strategy-review\` | Full EIID alignment analysis |
| \`/design-review\` | Audit UI, a11y, design tokens |
| \`/trust-audit\` | OWASP Top 10 + GDPR checklist |
| \`/efficiency-review\` | Bundle, CWV, N+1, cost report |
| \`/testing-verify\` | Run full test suite, report failures |

### Subagents

Five subagents in \`.claude/agents/\` provide specialized competencies:
- **strategy** — EIID alignment, CLAUDE.md ownership
- **design** — UI, shadcn, accessibility, brand
- **trust** — Security, GDPR, blocking authority
- **efficiency** — Performance, costs, optimization
- **testing** — Test verification, regression prevention

### Hooks (automatic)

- **SessionStart**: Detects first run, suggests init skills
- **PreToolUse (Bash)**: Trust blocks dangerous commands
- **PostToolUse (Write|Edit)**: Trust scans for security issues
- **Stop**: Testing verifies all tests pass before stopping

### Rules

1. **strategy** appends to this file (append-only for decisions)
2. **trust** can block commits for security issues
3. **testing** blocks stop if tests fail
4. **design** and **efficiency** advise but don't block
5. All skills update CLAUDE.md with their findings
`;
}
