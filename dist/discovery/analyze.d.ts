import type { DiscoveryInput, DiscoveryResult } from './types.js';
export declare function stripMarkdownFences(text: string): string;
export declare function analyzeDiscoveryInput(input: DiscoveryInput): Promise<DiscoveryResult>;
export declare function analyzeRawContent(content: string, contentType: 'text' | 'file', fileName?: string): Promise<DiscoveryResult>;
//# sourceMappingURL=analyze.d.ts.map