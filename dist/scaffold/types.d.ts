import type { DiscoveryResult } from '../discovery/types.js';
import type { SelectionResult } from '../catalog/types.js';
export interface ScaffoldInput {
    discovery: DiscoveryResult;
    tools: SelectionResult;
}
export interface ScaffoldOptions {
    outputDir: string;
    verbose?: boolean;
    skipInstall?: boolean;
}
export interface SkillConfig {
    name: string;
    focus: string;
    triggers: string[];
    systemPrompt: string;
}
/** @deprecated Use SkillConfig instead */
export type TeammateConfig = SkillConfig;
export interface AgentTeamConfig {
    skills: SkillConfig[];
    hooks: HooksConfig;
}
export interface HooksConfig {
    sessionStart: SessionStartHook[];
    preToolUse: PreToolUseHook[];
    postToolUse: PostToolUseHook[];
    stop: StopHook[];
}
export interface SessionStartHook {
    matcher: string;
    hooks: Array<{
        type: 'command';
        command: string;
        statusMessage?: string;
    }>;
}
export interface PreToolUseHook {
    matcher: string;
    hooks: Array<{
        type: 'prompt';
        prompt: string;
        timeout?: number;
    }>;
}
export interface PostToolUseHook {
    matcher: string;
    hooks: Array<{
        type: 'prompt';
        prompt: string;
        timeout?: number;
    }>;
}
export interface StopHook {
    hooks: Array<{
        type: 'agent' | 'prompt';
        prompt: string;
        timeout?: number;
    }>;
}
export interface ScaffoldResult {
    projectPath: string;
    filesCreated: string[];
    packagesToInstall: string[];
    envVars: string[];
    agentTeam: AgentTeamConfig;
}
//# sourceMappingURL=types.d.ts.map