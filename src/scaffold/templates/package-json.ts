// Pinned versions for generated projects
const SDK_VERSIONS: Record<string, string> = {
  '@supabase/supabase-js': '^2.49.0',
  'inngest': '^3.31.0',
  '@anthropic-ai/sdk': '^0.76.0',
  'openai': '^4.85.0',
  '@getbrevo/brevo': '^2.2.0',
  'grammy': '^1.35.0',
  '@slack/bolt': '^4.3.0',
  'discord.js': '^14.17.0',
  '@whiskeysockets/baileys': '^6.7.0',
  'apify-client': '^2.11.0',
  '@supermemory/ai-sdk': '^0.1.0',
  '@playwright/test': '^1.49.0'
};

export function generatePackageJson(projectName: string, packages: string[]): object {
  const dependencies: Record<string, string> = {
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  };

  // Add selected packages with pinned versions
  for (const pkg of packages) {
    dependencies[pkg] = SDK_VERSIONS[pkg] || '^0.1.0';
  }

  return {
    "name": projectName,
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "test": "vitest run",
      "test:watch": "vitest",
      "test:e2e": "npx playwright test",
      "inngest:dev": "npx inngest-cli@latest dev"
    },
    "dependencies": Object.fromEntries(
      Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b))
    ),
    "devDependencies": {
      "@playwright/test": "^1.49.0",
      "@types/node": "^22.15.0",
      "@types/react": "^19.1.0",
      "@types/react-dom": "^19.1.0",
      "autoprefixer": "^10.4.0",
      "postcss": "^8.5.0",
      "tailwindcss": "^3.4.0",
      "typescript": "^5.8.0",
      "vitest": "^4.0.0"
    }
  };
}
