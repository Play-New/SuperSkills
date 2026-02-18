export function generateEnvExample(tools) {
    const envVars = new Set();
    for (const suggestion of tools.all) {
        for (const envVar of suggestion.tool.envVars) {
            envVars.add(envVar);
        }
    }
    // Always include shadcnblocks (design system, not a tool)
    envVars.add('SHADCNBLOCKS_API_KEY');
    const lines = [
        '# Environment Variables',
        '# Copy this file to .env.local and fill in the values',
        '',
        '# ===================',
        '# Core Services',
        '# ===================',
        ''
    ];
    // Group by service
    const grouped = {
        supabase: [],
        vercel: [],
        inngest: [],
        anthropic: [],
        openai: [],
        shadcnblocks: [],
        brevo: [],
        telegram: [],
        slack: [],
        discord: [],
        apify: [],
        supermemory: [],
        other: []
    };
    for (const envVar of envVars) {
        const lower = envVar.toLowerCase();
        if (lower.includes('supabase')) {
            grouped.supabase.push(envVar);
        }
        else if (lower.includes('vercel')) {
            grouped.vercel.push(envVar);
        }
        else if (lower.includes('inngest')) {
            grouped.inngest.push(envVar);
        }
        else if (lower.includes('anthropic')) {
            grouped.anthropic.push(envVar);
        }
        else if (lower.includes('openai')) {
            grouped.openai.push(envVar);
        }
        else if (lower.includes('shadcnblocks')) {
            grouped.shadcnblocks.push(envVar);
        }
        else if (lower.includes('brevo')) {
            grouped.brevo.push(envVar);
        }
        else if (lower.includes('telegram')) {
            grouped.telegram.push(envVar);
        }
        else if (lower.includes('slack')) {
            grouped.slack.push(envVar);
        }
        else if (lower.includes('discord')) {
            grouped.discord.push(envVar);
        }
        else if (lower.includes('apify')) {
            grouped.apify.push(envVar);
        }
        else if (lower.includes('supermemory')) {
            grouped.supermemory.push(envVar);
        }
        else {
            grouped.other.push(envVar);
        }
    }
    const sectionNames = {
        supabase: 'Supabase',
        vercel: 'Vercel',
        inngest: 'Inngest',
        anthropic: 'Claude (Anthropic)',
        openai: 'OpenAI',
        shadcnblocks: 'shadcnblocks (UI blocks, optional)',
        brevo: 'Brevo (Email/SMS/WhatsApp)',
        telegram: 'Telegram',
        slack: 'Slack',
        discord: 'Discord',
        apify: 'Apify',
        supermemory: 'Supermemory',
        other: 'Other'
    };
    for (const [key, vars] of Object.entries(grouped)) {
        if (vars.length > 0) {
            lines.push(`# ${sectionNames[key]}`);
            for (const v of vars.sort()) {
                lines.push(`${v}=`);
            }
            lines.push('');
        }
    }
    return lines.join('\n');
}
//# sourceMappingURL=env-example.js.map