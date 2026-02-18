import * as p from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import type { DiscoveryResult } from '../discovery/types.js';
import type { SelectionResult } from '../catalog/types.js';
import type { ScaffoldResult } from './types.js';
import { scaffold } from './index.js';

export async function runScaffold(
  discovery: DiscoveryResult,
  tools: SelectionResult
): Promise<ScaffoldResult | null> {
  p.intro(pc.bgGreen(pc.black(' Scaffold ')));
  console.log(pc.dim('\n  Generating AI-native project with SuperSkills.\n'));

  // Ask for output directory
  const outputDir = await p.text({
    message: 'Output directory:',
    placeholder: './',
    initialValue: './',
    validate: (v) => {
      if (!v) return 'Please specify an output directory';
      return undefined;
    }
  });

  if (p.isCancel(outputDir)) {
    p.cancel('Cancelled');
    return null;
  }

  // Confirm
  const projectName = slugify(discovery.projectName);
  const fullPath = path.resolve(outputDir as string, projectName);

  console.log('');
  p.note(
    pc.bold('Project: ') + projectName + '\n' +
    pc.bold('Path: ') + fullPath + '\n\n' +
    pc.bold('Will create:\n') +
    pc.dim('  - CLAUDE.md (living document)\n') +
    pc.dim('  - .claude/settings.json (hooks)\n') +
    pc.dim('  - .claude/agents/ (5 subagents)\n') +
    pc.dim('  - .claude/skills/ (10 slash commands)\n') +
    pc.dim('  - Next.js + Tailwind project\n') +
    pc.dim('  - Inngest workflows\n') +
    pc.dim('  - Supabase setup\n') +
    pc.dim('  - Delivery integrations'),
    'Scaffold Preview'
  );

  const confirm = await p.confirm({
    message: 'Proceed with scaffold?',
    initialValue: true
  });

  if (p.isCancel(confirm) || !confirm) {
    p.cancel('Cancelled');
    return null;
  }

  // Run scaffold
  const spinner = p.spinner();
  spinner.start('Generating project...');

  try {
    const result = await scaffold(
      { discovery, tools },
      { outputDir: outputDir as string }
    );

    spinner.stop('Project generated');

    // Display results
    displayResults(result);

    console.log('');
    console.log(pc.green('  +-----------------------------------------+'));
    console.log(pc.green('  |                                         |'));
    console.log(pc.green('  |   Project ready. Skills armed.          |'));
    console.log(pc.green('  |   Open in Claude Code and start.        |'));
    console.log(pc.green('  |                                         |'));
    console.log(pc.green('  +-----------------------------------------+'));
    p.outro(pc.dim('superskills'));

    return result;
  } catch (error) {
    spinner.stop('Scaffold failed');
    if (error instanceof Error) {
      p.log.error(error.message);
    }
    return null;
  }
}

function displayResults(result: ScaffoldResult): void {
  console.log('');

  // Files created
  p.note(
    result.filesCreated.map(f => pc.dim(`  ${f}`)).join('\n'),
    `Files Created (${result.filesCreated.length})`
  );

  // Next steps
  const projectDir = path.basename(result.projectPath);

  p.note(
    pc.cyan(`1. cd ${projectDir}`) + '\n' +
    pc.cyan('2. npm install') + '\n' +
    pc.cyan('3. cp .env.example .env.local') + '\n' +
    pc.cyan('4. Fill in .env.local (see below)') + '\n' +
    pc.cyan('5. npx supabase start') + pc.dim('  (local Supabase, needs Docker)') + '\n' +
    pc.cyan('6. npm run dev') + '\n' +
    pc.cyan('7. Open Claude Code in this folder and run the init skills:') + '\n' +
    pc.dim('   /strategy-init  /design-init  /trust-init  /testing-init'),
    'Next Steps'
  );

  // Env var guide
  const envGuide = [
    ['ANTHROPIC_API_KEY', 'console.anthropic.com/settings/keys'],
    ['OPENAI_API_KEY', 'platform.openai.com/api-keys'],
    ['SUPABASE_URL', 'Printed by `npx supabase start` or app.supabase.com'],
    ['SUPABASE_ANON_KEY', 'Printed by `npx supabase start` or app.supabase.com'],
    ['SUPABASE_SERVICE_ROLE_KEY', 'Printed by `npx supabase start` or app.supabase.com'],
    ['SHADCNBLOCKS_API_KEY', 'shadcnblocks.com/dashboard (optional, for pro blocks)'],
  ];

  // Add delivery-specific env vars
  const deliveryEnvMap: Record<string, [string, string]> = {
    BREVO_API_KEY: ['BREVO_API_KEY', 'app.brevo.com/settings/keys/api'],
    TELEGRAM_BOT_TOKEN: ['TELEGRAM_BOT_TOKEN', 'Talk to @BotFather on Telegram'],
    SLACK_BOT_TOKEN: ['SLACK_BOT_TOKEN', 'api.slack.com/apps'],
    SLACK_SIGNING_SECRET: ['SLACK_SIGNING_SECRET', 'api.slack.com/apps'],
    DISCORD_BOT_TOKEN: ['DISCORD_BOT_TOKEN', 'discord.com/developers/applications'],
    APIFY_API_TOKEN: ['APIFY_API_TOKEN', 'console.apify.com/account/integrations'],
    SUPERMEMORY_API_KEY: ['SUPERMEMORY_API_KEY', 'supermemory.ai'],
  };

  for (const envVar of result.envVars) {
    if (deliveryEnvMap[envVar]) {
      envGuide.push(deliveryEnvMap[envVar]);
    }
  }

  p.note(
    envGuide.map(([name, where]) =>
      pc.bold(name) + '\n' + pc.dim(`  ${where}`)
    ).join('\n\n'),
    'Where to get each key'
  );

  // Skills info
  p.note(
    pc.bold('Skills configured:\n') +
    result.agentTeam.skills.map(s =>
      pc.dim(`  - ${s.name}: ${s.focus}`)
    ).join('\n') + '\n\n' +
    pc.bold('Autonomous hooks:\n') +
    pc.dim('  - SessionStart: first-run detection\n') +
    pc.dim('  - PreToolUse: fast security gate\n') +
    pc.dim('  - PostToolUse: fast security gate\n') +
    pc.dim('  - Stop: full audit (tests + trust + strategy + design)\n') +
    pc.dim('         writes all findings to CLAUDE.md'),
    'SuperSkills'
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
