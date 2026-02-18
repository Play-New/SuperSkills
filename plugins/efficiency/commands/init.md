---
description: Set performance budgets and monitoring
argument-hint: "[optional: LCP target, bundle limit]"
---

# /efficiency:init

Set up performance monitoring and budgets.

## Steps

1. Ask for targets: LCP (< 2.5s), bundle (< 200KB gzip), API response (< 500ms)
2. Add `@next/bundle-analyzer` and `analyze` script
3. Set up Web Vitals reporting
4. Review dependencies for optimization
5. Tool-specific:
   - **Supabase**: verify `.select()` uses specific columns
   - **Vercel**: enable ISR, configure edge runtime
   - **Inngest**: check concurrency limits
   - **Next.js**: verify Server Components by default
