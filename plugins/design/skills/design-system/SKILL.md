---
name: design-system
description: Enforce shadcnblocks/shadcn usage, design tokens, WCAG 2.1 AA accessibility, and responsive design
---

# Design System

Enforce correct use of shadcnblocks, shadcn, design tokens, accessibility, and responsive design.

## When This Activates

Automatically when working on UI components, layouts, or styling.

## HARD RULES

These rules are non-negotiable. Every violation is a finding.

### Rule 1: shadcnblocks FIRST

Before building any UI section, check if a shadcnblocks block exists.
1351 blocks across 90+ categories: hero, pricing, dashboard, auth, settings, e-commerce, features, testimonials, FAQ, footer, navbar, sidebar, stats, CTA, contact, blog, 404, and more.
Most blocks are FREE and work without an API key.

```bash
npx shadcn add @shadcnblocks/hero125
npx shadcn add @shadcnblocks/sidebar10
```

If a block exists for the use case, USE IT. Do not build from scratch.

### Rule 2: shadcn base SECOND

If no shadcnblocks block fits, use shadcn components: button, card, input, label, badge, dialog, dropdown-menu, table, tabs, sheet, separator, avatar, tooltip.

### Rule 3: NEVER custom CSS classes

No `.my-card`, no `.custom-header`. Zero custom CSS class names.
All styling through Tailwind utility classes reading from theme variables.

### Rule 4: Global token file required

`src/app/globals.css` must define CSS custom properties:
- Colors in HSL (--primary, --secondary, --accent, --destructive, --muted, --card, --popover, --border, --ring, --background, --foreground)
- Border radius (--radius)

`tailwind.config.ts` extends from these CSS variables.

### Rule 5: Zero inline arbitrary values

No `text-[#FF5733]`, no `p-[13px]`, no `w-[237px]`.
Only Tailwind scale values and theme classes.

## Accessibility (WCAG 2.1 AA)

- Color contrast >= 4.5:1 normal text, 3:1 large text
- Visible focus states on all interactive elements
- Alt text on images, labels on form inputs
- Touch targets >= 44x44px
