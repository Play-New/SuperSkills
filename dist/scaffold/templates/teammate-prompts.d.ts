import type { DiscoveryResult } from '../../discovery/types.js';
import type { SelectionResult } from '../../catalog/types.js';
export declare function createStrategyPrompt(discovery: DiscoveryResult): string;
export declare function createDesignPrompt(discovery: DiscoveryResult): string;
export declare function createTrustPrompt(discovery: DiscoveryResult): string;
export declare function createEfficiencyPrompt(discovery: DiscoveryResult, tools?: SelectionResult): string;
export declare function createTestingPrompt(discovery: DiscoveryResult): string;
//# sourceMappingURL=teammate-prompts.d.ts.map