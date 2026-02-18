import type { DiscoveryResult } from '../../discovery/types.js';

interface SkillSpec {
  name: string;
  description: string;
  content: (discovery: DiscoveryResult) => string;
}

const INIT_SKILLS: SkillSpec[] = [
  {
    name: 'strategy-start',
    description: 'Define a project from scratch. Maps business problem to EIID framework, writes CLAUDE.md.',
    content: () => `# /strategy-start

Start a new project or redefine the strategic foundation for this one.

No API key needed. Claude Code does the analysis directly.

## Before Starting

1. Read the codebase: CLAUDE.md, package.json, README.md, source files, .env.example
2. If CLAUDE.md already has an EIID mapping, suggest \`/strategy-init\` instead
3. Use existing files as context. Do not ask what the code already tells you.

## Conversation

Ask about what you do not know. Skip what you can infer. Four things needed:

1. **The problem.** What costs time, money, or attention today?
2. **The data.** What systems, APIs, files, data sources exist?
3. **The people.** Who needs the output? Where are they? (email, Slack, WhatsApp, Telegram)
4. **The outcome.** What does success look like?

One round of questions. Two at most.

## EIID Mapping

Build the four-layer mapping:

- **Enrichment**: existing data, missing data, sources to connect
- **Inference**: patterns to detect, predictions, anomalies to flag
- **Interpretation**: actionable insights to surface
- **Delivery**: channels, triggers, timing

## Output

Update CLAUDE.md with: Context, Problem, Desired Outcome, EIID mapping, Architecture Decisions section.

Then suggest: \`/strategy-init\` to validate and prioritize, plus which other skills to activate.

## Rules

- One conversation, then write. Do not iterate endlessly.
- Concrete items, not vague categories. "Gmail inbox" not "email data".
- CLAUDE.md is the deliverable.
- Do not suggest tools or tech stack.
`
  },
  {
    name: 'strategy-init',
    description: 'Validate EIID mapping, set priorities, write first decision to CLAUDE.md',
    content: (discovery) => `# /strategy-init

Validate the EIID mapping and set project priorities.

## Steps

1. Read CLAUDE.md and understand the current EIID mapping
2. Validate that each EIID layer has concrete, actionable items:
   - **Enrichment**: Are data sources identified? Are there gaps?
   - **Inference**: Are patterns specific and measurable?
   - **Interpretation**: Are insights clearly defined?
   - **Delivery**: Are channels configured? Are triggers defined?
3. Ask the user to prioritize: which EIID layer to focus on first
4. Write the first strategic decision to CLAUDE.md in the Architecture Decisions section

## Project Context

**Problem:** ${discovery.problem}
**Desired Outcome:** ${discovery.desiredOutcome}

## Output

Append to CLAUDE.md:

\`\`\`markdown
### [Date] - Initial Strategy Validation

**Context:** Project initialized via SuperSkills
**Decision:** [Priority layer] is the first focus area
**Consequences:** [What this means for development order]
\`\`\`
`
  },
  {
    name: 'design-init',
    description: 'Configure brand, shadcn/shadcnblocks, design tokens, and SHADCNBLOCKS_API_KEY',
    content: () => `# /design-init

Set up the design system for this project. Uses shadcnblocks (1351 blocks) and shadcn base components.

## Steps

1. **SHADCNBLOCKS_API_KEY** (optional, only for pro blocks):
   - Most blocks are FREE and work without a key
   - If the user has a pro key: save to \`.env.local\` as SHADCNBLOCKS_API_KEY
   - If not: continue normally — free blocks cover most use cases

2. **Verify components.json** has the shadcnblocks registry:
   \`\`\`json
   {
     "registries": {
       "@shadcnblocks": {
         "url": "https://shadcnblocks.com/r",
         "headers": {
           "Authorization": "Bearer \${SHADCNBLOCKS_API_KEY}"
         }
       }
     }
   }
   \`\`\`

3. **Ask the user for brand assets:**
   - Color palette (primary, secondary, accent, destructive) in HSL
   - Font family (sans, mono)
   - Logo path (if available)

4. **Set up global design tokens** in \`src/app/globals.css\`:
   - CSS custom properties for ALL colors in HSL format:
     --background, --foreground, --card, --card-foreground, --popover, --popover-foreground,
     --primary, --primary-foreground, --secondary, --secondary-foreground, --muted,
     --muted-foreground, --accent, --accent-foreground, --destructive, --destructive-foreground,
     --border, --input, --ring, --radius
   - Both :root (light) and .dark (dark) variants
   - NO hardcoded hex or rgb anywhere in the file

5. **Configure tailwind.config.ts** to extend from CSS variables:
   - colors read from var(--primary), var(--secondary), etc.
   - borderRadius reads from var(--radius)
   - fontFamily from user choices

6. **Initialize shadcn**: \`npx shadcn init\`

7. **Install base shadcn components**:
   \`\`\`bash
   npx shadcn add button card input label badge dialog dropdown-menu table
   \`\`\`

8. **Ask about shadcnblocks layouts** to install:
   - Dashboard: \`npx shadcn add @shadcnblocks/sidebar10\`
   - Auth pages: \`npx shadcn add @shadcnblocks/login1\`
   - Settings: \`npx shadcn add @shadcnblocks/settings1\`
   - Hero: \`npx shadcn add @shadcnblocks/hero125\`
   - Pricing: \`npx shadcn add @shadcnblocks/pricing3\`
   Install what the user selects.

## HARD RULES (enforce from day one)

- **shadcnblocks FIRST**: If a block exists for the use case, use it
- **shadcn base SECOND**: Standard components for everything else
- **NEVER custom CSS classes**: No .my-card, no .custom-header
- **ZERO inline arbitrary values**: No text-[#FF5733], no p-[13px]
- **All colors from tokens**: Components read from CSS variables via Tailwind theme

## Output

- \`components.json\` with shadcnblocks registry
- \`src/app/globals.css\` with full token set
- \`tailwind.config.ts\` extending from tokens
- shadcn components and blocks installed
- Update CLAUDE.md with design decisions
`
  },
  {
    name: 'trust-init',
    description: 'Configure auth flow, RLS policies, CORS, and data sensitivity levels',
    content: (discovery) => `# /trust-init

Set up security foundations for this project.

## Steps

1. Ask the user about authentication requirements:
   - Auth method: Supabase Auth (email/password, OAuth, magic link)
   - Protected routes: which pages require auth
   - Role-based access: admin, user, etc.

2. Configure Supabase Row Level Security (RLS):
   - Create initial RLS policies for main tables
   - Enable RLS on all tables by default
   - Create helper functions for auth checks

3. Ask about data sensitivity:
   - PII fields to protect
   - Data retention requirements
   - GDPR requirements (consent, export, deletion)

4. Configure CORS:
   - Allowed origins for production
   - API route protection middleware

5. Set up environment variable validation:
   - Verify all required env vars are set at startup

## Project Context

**Industry:** ${discovery.context.industry || 'Not specified'}
**Data Sources:** ${discovery.availableData.join(', ') || 'Not specified'}

## Output

- Supabase migration with RLS policies
- Auth middleware for Next.js
- Environment variable validation
- Update CLAUDE.md with security decisions
`
  },
  {
    name: 'efficiency-init',
    description: 'Set performance budgets, configure bundle analysis, and monitoring',
    content: () => `# /efficiency-init

Set up performance monitoring and budgets.

## Steps

1. Ask the user for performance targets:
   - LCP target (default: < 2.5s)
   - Bundle size limit (default: < 200KB gzipped)
   - API response time target (default: < 500ms)

2. Configure bundle analysis:
   - Add \`@next/bundle-analyzer\` to dev dependencies
   - Add \`analyze\` script to package.json

3. Set up performance tracking:
   - Add Web Vitals reporting in layout.tsx
   - Configure Vercel Analytics (if using Vercel)

4. Review current dependencies for optimization:
   - Check for heavy imports that should be dynamic
   - Verify tree-shaking is working

## Output

- Performance budget documented in CLAUDE.md
- Bundle analyzer configured
- Web Vitals reporting set up
- Update CLAUDE.md with performance decisions
`
  },
  {
    name: 'testing-init',
    description: 'Set up vitest + Playwright, define critical scenarios, write first smoke test',
    content: () => `# /testing-init

Set up the testing infrastructure.

## Steps

1. Configure vitest:
   - Verify vitest config in package.json or vitest.config.ts
   - Set up test directory structure: \`tests/unit/\`, \`tests/e2e/\`
   - Add test scripts to package.json

2. Configure Playwright:
   - Run \`npx playwright install\`
   - Verify playwright.config.ts exists
   - Set up base URL for local development

3. Ask the user for critical test scenarios:
   - What are the most important user flows?
   - What must never break?

4. Write first tests:
   - Unit smoke test: verify core utilities work
   - E2E smoke test: verify home page loads and renders
   - Add to CI if available

5. Run tests to verify setup:
   - \`npm test\` for vitest
   - \`npx playwright test\` for E2E

## Output

- vitest configured and running
- Playwright configured with sample E2E test
- Critical scenarios documented
- Update CLAUDE.md with testing strategy
`
  }
];

const REVIEW_SKILLS: SkillSpec[] = [
  {
    name: 'strategy-review',
    description: 'Full EIID alignment analysis + proactive opportunity scan',
    content: (discovery) => `# /strategy-review

Perform a full strategic review and opportunity scan.

## Part 1: Alignment Check

1. Read CLAUDE.md for current strategic context
2. Scan all source files for EIID alignment:
   - Are enrichment sources being used?
   - Are inference patterns implemented?
   - Are insights being generated?
   - Are delivery channels active?
3. Check for scope creep:
   - Features not in original EIID mapping
   - Dependencies not in the tools catalog
4. Review recent commits for strategic drift

## Part 2: Opportunity Scan

This is the more valuable part. Look at the codebase and suggest:

- **Enrichment opportunities**: Data sources available but not connected. Data collected but not used for inference. Cross-referencing opportunities between existing sources.
- **Inference opportunities**: Patterns detectable from existing data but not analyzed. Predictions the data supports but no one has built. Anomaly detection that would catch problems early.
- **Interpretation opportunities**: Insights generated but not surfaced clearly. New angles on existing data (trends, comparisons, outlier explanations). Context that would make insights more actionable.
- **Delivery opportunities**: Channels users frequent but the system does not reach. Timing improvements. Trigger conditions currently missed.

Examples of good findings:
- "Supplier data is available but not used for delay prediction. Enrichment opportunity."
- "Order anomaly patterns could predict customer churn. Inference opportunity."
- "Email reports work but Slack would reach the ops team faster. Delivery opportunity."

## Project Context

**Problem:** ${discovery.problem}
**Desired Outcome:** ${discovery.desiredOutcome}
**Opportunities (from discovery):** ${discovery.strategicAnalysis.opportunities.join(', ')}

## Output

Append findings to CLAUDE.md Architecture Decisions section.
Each finding gets a **Type** (alignment-check | opportunity | drift-warning) and a **Layer** (enrichment | inference | interpretation | delivery).
`
  },
  {
    name: 'design-review',
    description: 'Audit shadcnblocks/shadcn usage, hard rule violations, a11y, responsive',
    content: () => `# /design-review

Audit the UI against the five hard rules, accessibility, and responsive design.

## Hard Rule Violations (check first)

Scan ALL component files (\`src/app/**/*.tsx\`, \`src/components/**/*.tsx\`) for:

1. **shadcnblocks FIRST**: Is there a UI section that could be replaced by a shadcnblocks block? (hero, pricing, dashboard, auth, settings, e-commerce, features, testimonials, FAQ, footer, navbar, sidebar, stats, CTA, contact, blog, 404)
2. **shadcn base SECOND**: Is there a custom component that duplicates shadcn functionality?
3. **No custom CSS classes**: Search for className strings containing custom class names (not Tailwind utilities)
4. **Token compliance**: Search for hardcoded hex (#xxx), rgb(), hsl() values in component files. These must come from CSS variables.
5. **No arbitrary values**: Search for Tailwind arbitrary value syntax: \`-\\[.*\\]\` in className strings

## Accessibility (WCAG 2.1 AA)

- Color contrast ratios (4.5:1 normal text, 3:1 large text)
- Keyboard navigation (focus states, tab order)
- Screen reader compatibility (semantic HTML, ARIA)
- Touch targets (44x44px minimum)
- Alt text on images
- Labels on form inputs

## Responsive

- Verify mobile layout (320px minimum)
- Check breakpoint consistency (sm/md/lg/xl)

## Output

Per issue:

**File:** path/to/file.tsx:line
**Rule Violated:** Rule [1-5] or a11y or responsive
**Issue:** Brief description
**Fix:** What to change (include exact shadcn/shadcnblocks command if applicable)

Update CLAUDE.md with design review findings.
`
  },
  {
    name: 'trust-audit',
    description: 'Full OWASP Top 10 + GDPR compliance checklist',
    content: (discovery) => `# /trust-audit

Perform a comprehensive security and compliance audit.

## Steps

1. **OWASP Top 10 scan:**
   - Broken access control: check all API routes for auth
   - Injection: check for unsanitized user input in queries
   - XSS: check for unescaped user content in templates
   - SSRF: check for user-provided URLs
   - Security misconfiguration: check CORS, headers, debug mode

2. **Secrets scan:**
   - Search for hardcoded API keys, passwords, tokens
   - Verify .env.local is in .gitignore
   - Check for secrets in git history

3. **GDPR compliance:**
   - Consent mechanisms present
   - Data export capability
   - Data deletion capability
   - Privacy policy referenced
   - Data minimization practiced

4. **Dependency audit:**
   - Run \`npm audit\`
   - Check for known vulnerabilities

## Project Context

**Industry:** ${discovery.context.industry || 'Not specified'}
**Data Handled:** ${discovery.availableData.join(', ') || 'Not specified'}

## Output

Security report with severity levels. Update CLAUDE.md with audit findings.
`
  },
  {
    name: 'efficiency-review',
    description: 'Bundle size, Core Web Vitals, N+1 queries, and cost report',
    content: () => `# /efficiency-review

Perform a comprehensive efficiency audit.

## Steps

1. **Bundle analysis:**
   - Run \`npx next build\` and check output sizes
   - Identify largest dependencies
   - Check for unnecessary imports

2. **Core Web Vitals:**
   - Check LCP: largest content paint targets
   - Check CLS: layout shift sources
   - Check FID: main thread blocking

3. **Database queries:**
   - Search for N+1 patterns (queries in loops)
   - Check for missing indexes
   - Verify batch operations where possible

4. **API cost estimate:**
   - Count LLM call sites
   - Estimate tokens per call
   - Check for caching opportunities

5. **Caching opportunities:**
   - Static data that could be cached
   - Repeated API calls
   - Expensive computations

## Output

Efficiency report with metrics and recommendations. Update CLAUDE.md with performance findings.
`
  },
  {
    name: 'testing-verify',
    description: 'Run full test suite and report failures',
    content: () => `# /testing-verify

Run the complete test suite and report results.

## Steps

1. Run unit tests:
   \`\`\`bash
   npm test -- --run
   \`\`\`

2. Run E2E tests (if Playwright is configured):
   \`\`\`bash
   npx playwright test
   \`\`\`

3. Run type checking:
   \`\`\`bash
   npx tsc --noEmit
   \`\`\`

4. Report results:
   - Total tests: passed / failed / skipped
   - Failed test details with file paths
   - Type errors with file paths
   - Suggestions for fixing failures

5. If any tests fail, do NOT mark the task as complete.

## Output

Test report with pass/fail counts. Update CLAUDE.md with test coverage status.
`
  }
];

function generateSkillFrontmatter(skill: SkillSpec): string {
  return `---
name: ${skill.name}
description: ${skill.description}
---

`;
}

export function generateSkillCommands(discovery: DiscoveryResult): Record<string, string> {
  const files: Record<string, string> = {};

  for (const skill of [...INIT_SKILLS, ...REVIEW_SKILLS]) {
    files[`.claude/skills/${skill.name}/SKILL.md`] = generateSkillFrontmatter(skill) + skill.content(discovery);
  }

  return files;
}
