export interface GdprInfo {
    compliant: boolean;
    dpaAvailable: boolean;
    dataLocation: string;
}
export interface Tool {
    id: string;
    name: string;
    category: 'core' | 'delivery' | 'community' | 'enrichment' | 'testing';
    description: string;
    sdk: string | null;
    envVars: string[];
    gdpr: GdprInfo;
    provides: string[];
    channels?: string[];
    note?: string;
    risk?: string;
    optional?: boolean;
}
export interface ToolsCatalog {
    version: string;
    categories: Record<string, string>;
    tools: Tool[];
    stacks: Record<string, {
        description: string;
        tools: string[];
    }>;
    eiidMapping: {
        enrichment: {
            description: string;
            tools: string[];
        };
        inference: {
            description: string;
            tools: string[];
        };
        interpretation: {
            description: string;
            tools: string[];
        };
        delivery: {
            description: string;
            tools: string[];
        };
    };
}
export interface ToolSuggestion {
    tool: Tool;
    reason: string;
    required: boolean;
}
export interface SelectionResult {
    core: ToolSuggestion[];
    delivery: ToolSuggestion[];
    enrichment: ToolSuggestion[];
    testing: ToolSuggestion[];
    all: ToolSuggestion[];
}
//# sourceMappingURL=types.d.ts.map