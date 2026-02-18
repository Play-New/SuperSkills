import { createStrategyPrompt, createDesignPrompt, createTrustPrompt, createEfficiencyPrompt, createTestingPrompt } from './teammate-prompts.js';
const AGENTS = [
    {
        name: 'strategy',
        tools: ['Read', 'Grep', 'Glob'],
        description: 'Use proactively after commits to check EIID alignment and suggest new opportunities across all four layers',
        memory: 'project',
        promptFn: createStrategyPrompt
    },
    {
        name: 'design',
        tools: ['Read', 'Grep', 'Glob', 'Bash'],
        model: 'sonnet',
        memory: 'project',
        description: 'Use proactively for UI setup with shadcnblocks/shadcn, design tokens, and design reviews',
        promptFn: createDesignPrompt
    },
    {
        name: 'trust',
        tools: ['Read', 'Grep', 'Glob', 'Bash'],
        description: 'Use proactively to audit security and compliance',
        promptFn: createTrustPrompt
    },
    {
        name: 'efficiency',
        tools: ['Read', 'Grep', 'Glob', 'Bash'],
        model: 'haiku',
        description: 'Use proactively to check performance and costs',
        promptFn: createEfficiencyPrompt
    },
    {
        name: 'testing',
        tools: ['Read', 'Grep', 'Glob', 'Bash'],
        memory: 'project',
        description: 'Use proactively to verify behavior with tests',
        promptFn: createTestingPrompt
    }
];
function generateFrontmatter(agent) {
    const lines = ['---'];
    lines.push(`tools: [${agent.tools.join(', ')}]`);
    if (agent.model)
        lines.push(`model: ${agent.model}`);
    if (agent.memory)
        lines.push(`memory: ${agent.memory}`);
    lines.push('---');
    return lines.join('\n');
}
export function generateSkillAgents(discovery, tools) {
    const files = {};
    for (const agent of AGENTS) {
        const frontmatter = generateFrontmatter(agent);
        const prompt = agent.promptFn(discovery, tools);
        const content = `${frontmatter}

# ${agent.name}

${agent.description}

${prompt}
`;
        files[`.claude/agents/${agent.name}.md`] = content;
    }
    return files;
}
//# sourceMappingURL=skill-agents.js.map