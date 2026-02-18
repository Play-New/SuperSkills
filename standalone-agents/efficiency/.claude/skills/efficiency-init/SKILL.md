---
name: efficiency-init
description: Set performance budgets, configure bundle analysis, and monitoring
---

# /efficiency-init

Set up performance monitoring and budgets.

## Steps

1. Ask the user for performance targets:
   - LCP target (default: < 2.5s)
   - Bundle size limit (default: < 200KB gzipped)
   - API response time target (default: < 500ms)

2. Configure bundle analysis:
   - Add `@next/bundle-analyzer` to dev dependencies
   - Add `analyze` script to package.json

3. Set up performance tracking:
   - Add Web Vitals reporting in layout.tsx
   - Configure Vercel Analytics (if using Vercel)

4. Review current dependencies for optimization:
   - Check for heavy imports that should be dynamic
   - Verify tree-shaking is working

5. Tool-specific optimizations:
   - **Supabase**: verify `.select()` uses specific columns
   - **Vercel**: enable ISR where appropriate, configure edge runtime
   - **Inngest**: check concurrency limits and step batching
   - **Next.js**: verify Server Components used by default

## Output

- Performance budget documented in CLAUDE.md
- Bundle analyzer configured
- Web Vitals reporting set up
