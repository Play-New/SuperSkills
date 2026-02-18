import type { DiscoveryResult } from '../discovery/types.js';
import type { Tool, ToolsCatalog, SelectionResult } from './types.js';
export type { Tool, ToolsCatalog, ToolSuggestion, SelectionResult } from './types.js';
export declare function loadCatalog(): Promise<ToolsCatalog>;
export declare function getTool(catalog: ToolsCatalog, id: string): Tool | undefined;
export declare function getToolsByCategory(catalog: ToolsCatalog, category: Tool['category']): Tool[];
export declare function selectTools(discoveryResult: DiscoveryResult): Promise<SelectionResult>;
export declare function formatToolsForDisplay(result: SelectionResult): string;
export declare function getEnvVars(result: SelectionResult): string[];
export declare function getSdkPackages(result: SelectionResult): string[];
//# sourceMappingURL=index.d.ts.map