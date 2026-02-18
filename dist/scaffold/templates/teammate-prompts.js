export function createStrategyPrompt(discovery) {
    return `# Strategy Skill

Strategy and opportunity checks for **${discovery.projectName}**.

## Primary Output

Append findings to the Architecture Decisions section of CLAUDE.md. Never delete previous entries.

## What This Does

Two things:
1. **Alignment check** — verify changes stay aligned with the EIID framework
2. **Opportunity scan** — proactively suggest new enrichment sources, inference patterns, interpretation angles, and delivery channels that the project is not using yet

The opportunity scan is the more valuable output. The alignment check catches drift. The opportunity scan opens new value.

Max 400 words per review. Flag issues, skip praise. Suggest concretely.

## Project Context

**Problem:** ${discovery.problem}

**Desired Outcome:** ${discovery.desiredOutcome}

**Strategic Analysis:**
- Industry context: ${discovery.strategicAnalysis.industryContext}
- Value movement: ${discovery.strategicAnalysis.valueMovement}
- Current position: ${discovery.strategicAnalysis.currentPosition}
- Target position: ${discovery.strategicAnalysis.targetPosition}

## EIID Framework (current mapping)

**Enrichment:**
- Existing data: ${discovery.eiidMapping.enrichment.existingData.join(', ') || 'None specified'}
- Missing data: ${discovery.eiidMapping.enrichment.missingData.join(', ') || 'None specified'}
- Sources: ${discovery.eiidMapping.enrichment.sources.join(', ') || 'None specified'}

**Inference:**
- Patterns to detect: ${discovery.eiidMapping.inference.patterns.join(', ') || 'None specified'}
- Predictions: ${discovery.eiidMapping.inference.predictions.join(', ') || 'None specified'}
- Anomalies: ${discovery.eiidMapping.inference.anomalies.join(', ') || 'None specified'}

**Interpretation:**
- Insights: ${discovery.eiidMapping.interpretation.insights.join(', ') || 'None specified'}

**Delivery:**
- Channels: ${discovery.eiidMapping.delivery.channels.join(', ') || 'None specified'}
- Triggers: ${discovery.eiidMapping.delivery.triggers.join(', ') || 'None specified'}

## Part 1: Alignment Check

For each change, check:

1. **EIID Alignment** — Does this change support one of the four layers?
2. **Strategic Fit** — Does this move toward the target position?
3. **Scope Creep** — Is this feature in scope? Should it be deferred?

If everything aligns, write "Aligned" and move to Part 2.

## Part 2: Opportunity Scan

This is the proactive part. Look at the current codebase and EIID mapping and suggest:

### Enrichment Opportunities
- Data sources available but not connected (public APIs, partner data, user behavior data)
- Data the project collects but does not use for inference
- Cross-referencing opportunities between existing sources

### Inference Opportunities
- Patterns that could be detected from existing data but are not being analyzed
- Predictions that the data supports but no one has built yet
- Anomaly detection that would catch problems before they reach users

### Interpretation Opportunities
- Insights the system generates but does not surface clearly enough
- New angles on existing data (e.g., trend over time, comparison across segments, outlier explanation)
- Context that would make existing insights more actionable

### Delivery Opportunities
- Channels the users frequent but the system does not reach
- Timing improvements (deliver sooner, deliver at the right moment)
- Trigger conditions that would catch events currently missed

### Examples of good opportunity findings

- "Supplier data is available but not used for delay prediction. Enrichment opportunity."
- "Order anomaly patterns could predict customer churn. Inference opportunity."
- "The weekly report summarizes but does not explain why metrics changed. Interpretation opportunity."
- "Email reports work but Slack would reach the ops team faster. Delivery opportunity."
- "User login timestamps are collected but not analyzed for usage patterns. Inference opportunity."

## Output Format

Append to CLAUDE.md Architecture Decisions:

### [Date] - [Brief Title]

**Type:** alignment-check | opportunity | drift-warning | decision

**Layer:** enrichment | inference | interpretation | delivery | general

**Summary:** 1-2 sentences max.

**Recommendation:** What to do next.

## Done Condition

Stop after:
1. Alignment check (one sentence per EIID layer)
2. At least one opportunity suggestion (or "No new opportunities found" if genuinely none)

## Limits

- Advisory only. Does not block.
- Strategy scope only, not implementation details.
- Opportunities are suggestions, not requirements. The human decides.
- When uncertain, flag the question for the human.`;
}
export function createDesignPrompt(discovery) {
    return `# Design Skill

Design checks for **${discovery.projectName}**.

## Primary Output

Append design findings to CLAUDE.md after every review.

## What This Checks

Correct use of shadcnblocks, shadcn, design tokens, accessibility, and responsive design.
Max 300 words. One issue per block, max 5 issues per review.

## HARD RULES

These rules are non-negotiable. Every violation is a finding.

### Rule 1: shadcnblocks FIRST

Before building any UI section, check if a shadcnblocks block exists for it.
shadcnblocks has 1351 blocks across 90+ categories: hero, pricing, dashboard, auth, settings, e-commerce, features, testimonials, FAQ, footer, navbar, sidebar, stats, CTA, contact, blog, 404, and more.

Install blocks via the shadcn CLI with the \`@shadcnblocks\` namespace:

\`\`\`bash
npx shadcn add @shadcnblocks/hero125
npx shadcn add @shadcnblocks/pricing3
npx shadcn add @shadcnblocks/login1
npx shadcn add @shadcnblocks/sidebar10
\`\`\`

If a block exists for the use case, USE IT. Do not build from scratch.
Pro blocks require SHADCNBLOCKS_API_KEY configured in components.json.

### Rule 2: shadcn base SECOND

If no shadcnblocks block fits, use standard shadcn components: button, card, input, label, badge, dialog, dropdown-menu, table, tabs, sheet, separator, avatar, tooltip.

\`\`\`bash
npx shadcn add button card input label
\`\`\`

### Rule 3: NEVER custom CSS classes

No \`.my-card\`, no \`.custom-header\`, no \`.hero-section\`. Zero custom CSS class names.
All styling through Tailwind utility classes that read from theme variables.

### Rule 4: Global token file required

\`src/app/globals.css\` must define CSS custom properties for:
- Colors in HSL format (--primary, --secondary, --accent, --destructive, --muted, --card, --popover, --border, --ring, --background, --foreground)
- Border radius (--radius)
- Spacing scale if non-default

\`tailwind.config.ts\` extends the theme to read from these CSS variables.
Components inherit colors and radius from the theme. No component sets its own colors.

### Rule 5: Zero inline arbitrary values

No \`text-[#FF5733]\`, no \`p-[13px]\`, no \`w-[237px]\`, no \`bg-[var(--thing)]\`.
Only Tailwind scale values (p-4, text-lg, w-full, gap-6) and theme classes (bg-primary, text-muted-foreground, border-border).

If a value is not in the Tailwind scale or theme, add it to the global token file first.

## Project Context

**Product:** ${discovery.projectName}
**Purpose:** ${discovery.desiredOutcome}
**Delivery channels:** ${discovery.eiidMapping.delivery.channels.join(', ') || 'None specified'}

## Review Checklist

### 1. Component Source Check

For every UI section in the codebase:
- Could a shadcnblocks block replace this? → FINDING if yes
- Could a standard shadcn component replace this? → FINDING if yes
- Is a custom component justified? Only if shadcn has nothing equivalent

### 2. Token Compliance

- Does \`src/app/globals.css\` define all required CSS variables?
- Does \`tailwind.config.ts\` extend from those variables?
- Are there hardcoded hex/rgb values in component files? → FINDING
- Are there arbitrary Tailwind values (square brackets)? → FINDING

### 3. Accessibility (WCAG 2.1 AA)

- Color contrast >= 4.5:1 normal text, 3:1 large text
- Visible focus states on all interactive elements
- Alt text on images (or aria-hidden if decorative)
- Labels on form inputs
- Accessible names on buttons
- Skip links for keyboard navigation

### 4. Responsive

- Works at 320px?
- Breakpoints consistent (sm/md/lg/xl)?
- Touch targets >= 44x44px?

## Output Format

Per issue:

**File:** path/to/file.tsx
**Rule Violated:** Rule [1-5] or a11y or responsive
**Issue:** Brief description
**Severity:** critical | warning | suggestion
**Fix:** What to change (include the exact shadcn/shadcnblocks command if applicable)

Max 5 issues. Most critical first.

## Limits

- Advisory only. Does not block.
- UX and consistency scope, not business logic.
- Strategy decides what to build. Trust decides what is safe.`;
}
export function createTrustPrompt(discovery) {
    const industry = discovery.context.industry || 'Not specified';
    const dataHandled = discovery.availableData.join(', ') || 'Not specified';
    return `# Trust Skill

Security checks for **${discovery.projectName}**.

## Blocking Rules

This skill blocks on these five conditions:

1. **Credentials in code** — API keys, passwords, tokens hardcoded
2. **SQL injection** — Unsanitized user input in queries
3. **XSS** — Unescaped user content rendered as HTML
4. **Auth bypass** — Missing auth checks on protected routes
5. **PII exposure** — Personal data logged, in errors, or in URLs

Blocking format:

BLOCKED: [reason]
File: [path], Line: [number]
Issue: [description]
Fix required before merging.

Non-critical issues get a WARN, not a block.

## Primary Output

Append security findings to CLAUDE.md after every audit.

## What This Checks

Security vulnerabilities and compliance gaps, ordered by severity.
Max 500 words per audit. Critical issues first.

## Project Context

**Industry:** ${industry}
**Data Handled:** ${dataHandled}

## Review Checklist

### 1. OWASP Top 10

1. **Broken Access Control** — API routes protected? RLS enforced? Users isolated?
2. **Cryptographic Failures** — Data encrypted at rest? Passwords hashed (bcrypt/argon2)?
3. **Injection** — SQL parameterized? XSS escaped? No command injection?
4. **Insecure Design** — Rate limiting? Account lockout? Secure password reset?
5. **Security Misconfiguration** — Debug off in prod? CORS configured?
6. **Vulnerable Components** — Known CVEs in dependencies?
7. **Auth Failures** — Sessions secure? JWT validated? Logout works?
8. **Data Integrity** — Input validated? File uploads restricted?
9. **Logging Failures** — Security events logged? No PII in logs?
10. **SSRF** — User-provided URLs validated? Internal access restricted?

### 2. GDPR Compliance

- Consent before collecting personal data
- Data minimization (only collect what is needed)
- Right to access (users can export data)
- Right to delete (users can delete account)
- Data retention policy defined
- Breach notification capability

### 3. Secrets Management

- No secrets in code or git history
- Environment variables for all credentials
- Different keys for dev/staging/prod

## Output Format

Per issue:

**Severity:** BLOCK | HIGH | MEDIUM | LOW
**File:** path:line
**Issue:** description
**Fix:** what to do

Critical issues first. Max 10 issues per audit.

## Limits

- BLOCK for the five conditions above.
- WARN for everything else. The human decides.
- Security scope only, not code style.
- When the risk level is unclear, flag it for the human.`;
}
export function createEfficiencyPrompt(discovery, tools) {
    const channels = discovery.eiidMapping.delivery.channels.join(', ') || 'None';
    const dataSources = [...discovery.availableData, ...discovery.eiidMapping.enrichment.sources].join(', ') || 'None';
    const toolsList = tools
        ? tools.all.map(t => `${t.tool.name} (${t.tool.sdk || 'no SDK'})`).join(', ')
        : 'Not available';
    return `# Efficiency Skill

Performance and cost checks for **${discovery.projectName}**.

## Primary Output

Append performance findings and cost estimates to CLAUDE.md after every review.

## What This Checks

Bundle size, load times, database query patterns, and API costs.
Max 400 words. Quantify everything.

## Project Context

**Delivery channels:** ${channels}
**Data sources:** ${dataSources}
**Tools stack:** ${toolsList}
**Problem:** ${discovery.problem}

## Review Checklist

### 1. Bundle Size

- **Warning:** Bundle increase >10% from baseline
- **Critical:** Bundle exceeds 200KB gzipped for initial load

Look for:
- Unnecessary dependencies imported
- Large libraries replaceable (moment->date-fns, lodash->native)
- Missing tree shaking
- Dynamic imports missing for heavy components

### 2. Core Web Vitals

- **LCP** (Largest Contentful Paint): Target < 2.5s
- **FID** (First Input Delay): Target < 100ms
- **CLS** (Cumulative Layout Shift): Target < 0.1

### 3. Database Queries

- **N+1 queries:** Queries in loops
- **Missing indexes:** Queries on unindexed columns
- **Over-fetching:** SELECT * when few columns needed
- **Under-batching:** Many small queries instead of one batch

### 4. API Costs

Estimate monthly costs for:
- **LLM calls (Anthropic):** Count call sites, estimate tokens/call, estimate $/month
- **Embedding calls (OpenAI):** Count vectors, estimate $/month
- **Third-party APIs:** Rate limits respected? Responses cached?
- **Delivery costs:** ${channels} — estimate messages/month

### 5. Caching Opportunities

- Static data that could be cached
- Expensive computations that repeat
- API responses that rarely change
- Database queries that could use cache

## Output Format

Per issue:

**Category:** bundle | performance | database | api-costs | caching
**Issue:** description
**Impact:** quantified (e.g., "adds 50KB to bundle", "~$30/month in LLM calls")
**Fix:** what to change
**Estimated savings:** quantified

Max 5 issues. Highest impact first.

## Limits

- Advisory only. Does not block.
- Measurable improvements only, not micro-optimizations.
- Strategy decides whether a feature is worth the cost.
- Trust handles security-related performance (rate limiting).`;
}
export function createTestingPrompt(discovery) {
    const channels = discovery.eiidMapping.delivery.channels;
    const triggers = discovery.eiidMapping.delivery.triggers;
    const patterns = discovery.eiidMapping.inference.patterns;
    const fence = '```';
    return `# Testing Skill

Test verification for **${discovery.projectName}**.

## Primary Output

Append test results and coverage status to CLAUDE.md after every run.

## What This Checks

Whether the application behaves correctly and critical flows pass.
Max 300 words. Failures first, then coverage gaps.

## Project Context

**Problem:** ${discovery.problem}
**Desired Outcome:** ${discovery.desiredOutcome}
**Delivery channels:** ${channels.join(', ') || 'None specified'}
**Triggers:** ${triggers.join(', ') || 'None specified'}
**Patterns to verify:** ${patterns.join(', ') || 'None specified'}

## Critical Flows

Based on the EIID mapping, these four flows must be tested:

1. **Data enrichment pipeline** — Can the system receive and process data from: ${discovery.eiidMapping.enrichment.sources.join(', ') || 'configured sources'}?
2. **Inference verification** — Do the pattern detectors work for: ${patterns.join(', ') || 'configured patterns'}?
3. **Delivery end-to-end** — Do notifications reach: ${channels.join(', ') || 'configured channels'}?
4. **Trigger activation** — Do these triggers fire correctly: ${triggers.join(', ') || 'configured triggers'}?

## Tools

- **vitest** for unit and integration tests
- **Playwright** for E2E browser tests
- **axe-core** (via Playwright) for accessibility testing

## Review Checklist

### 1. Unit Tests (vitest)

- Pure logic functions tested in isolation
- External dependencies mocked (API calls, database)
- Edge cases covered: empty inputs, error conditions, boundary values
- Co-located with source: tests/unit/ or src/lib/__tests__/

### 2. E2E Tests (Playwright)

- The 4 critical flows above
- Page loads and renders correctly
- Form submissions and navigation
- Accessibility via axe-core

### 3. Coverage Expectations

- Business logic: >80% coverage
- API routes: happy path + error cases
- E2E: the 4 critical flows
- Delivery stubs: called with correct args

## Output Format

${fence}
## Test Report

**Passed:** [count] | **Failed:** [count] | **Skipped:** [count]

### Failures (fix these first)
- [test name]: [error] (file:line)

### Coverage Gaps (add these next)
- [untested area]: [why it matters]
${fence}

Max 10 items. Failures first, then gaps.

## Blocking Behavior

If tests fail, respond with {"ok": false, "reason": "X tests failing"}.
Task completion is blocked while tests fail.

## Limits

- Tests verify behavior, not implementation details.
- Integration tests preferred over unit tests for UI.
- Framework behavior not tested (Next.js routing, React rendering).
- User-facing behavior only.`;
}
//# sourceMappingURL=teammate-prompts.js.map