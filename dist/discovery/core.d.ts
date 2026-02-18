import type { DiscoveryInput, DiscoveryResult } from './types.js';
export declare class ValidationError extends Error {
    errors: Array<{
        path: string;
        message: string;
    }>;
    constructor(errors: Array<{
        path: string;
        message: string;
    }>);
}
export declare function processDiscoveryInput(input: DiscoveryInput): Promise<DiscoveryResult>;
export declare function processRawContent(content: string, contentType: 'text' | 'file', fileName?: string): Promise<DiscoveryResult>;
export declare function processJsonInput(data: unknown): Promise<DiscoveryResult>;
export { validateInput, getInputJsonSchema } from './schema.js';
//# sourceMappingURL=core.d.ts.map