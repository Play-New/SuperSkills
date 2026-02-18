---
description: Set up design system with shadcnblocks, shadcn, and design tokens
argument-hint: "[optional: brand colors, font preferences]"
---

# /design-init

Set up the design system for this project. Uses shadcnblocks (1351 blocks, most are free) and shadcn base components.

## Steps

1. **SHADCNBLOCKS_API_KEY** (optional, only for pro blocks):
   - Most blocks are FREE and work without a key
   - If the user has a pro key: save to `.env.local` as SHADCNBLOCKS_API_KEY
   - If not: continue normally — free blocks cover most use cases

2. **Set up components.json** with the shadcnblocks registry:
   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "default",
     "rsc": true,
     "tsx": true,
     "tailwind": {
       "config": "tailwind.config.ts",
       "css": "src/app/globals.css",
       "baseColor": "neutral",
       "cssVariables": true
     },
     "aliases": {
       "components": "@/components",
       "utils": "@/lib/utils",
       "ui": "@/components/ui"
     },
     "registries": {
       "@shadcnblocks": {
         "url": "https://shadcnblocks.com/r"
       }
     }
   }
   ```

3. **Ask for brand assets**: color palette (HSL), font family, logo path

4. **Set up design tokens** in `src/app/globals.css`:
   - CSS custom properties for all colors in HSL format
   - Both :root (light) and .dark (dark) variants
   - NO hardcoded hex or rgb

5. **Configure tailwind.config.ts** to extend from CSS variables

6. **Create cn() utility** in `src/lib/utils.ts` (clsx + tailwind-merge)

7. **Initialize shadcn**: `npx shadcn init`

8. **Install base components**: `npx shadcn add button card input label badge dialog dropdown-menu table`

9. **Ask about shadcnblocks layouts**: dashboard, auth, settings, hero, pricing, etc. Examples:
   - `npx shadcn add @shadcnblocks/sidebar10`
   - `npx shadcn add @shadcnblocks/login1`
   - `npx shadcn add @shadcnblocks/hero125`

## HARD RULES

- **shadcnblocks FIRST**: If a block exists, use it
- **shadcn base SECOND**: Standard components for everything else
- **NEVER custom CSS classes**: No .my-card, no .custom-header
- **ZERO inline arbitrary values**: No text-[#FF5733], no p-[13px]
- **All colors from tokens**: CSS variables via Tailwind theme
