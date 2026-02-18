export type InputMode = 'paste' | 'file' | 'questions';

export interface Context {
  forWhom: 'me' | 'my_company' | 'client';
  companyName?: string;
  businessDescription: string;
  industry?: string;
  employees?: string;
  revenue?: string;
  yearsInBusiness?: string;
}

export interface DiscoveryInput {
  projectName: string;
  context: Context;
  problem: string;
  desiredOutcome: string;
  currentProcess: string[];
  availableData: string[];
}

export interface EIIDMapping {
  enrichment: {
    existingData: string[];
    missingData: string[];
    sources: string[];
  };
  inference: {
    patterns: string[];
    predictions: string[];
    anomalies: string[];
  };
  interpretation: {
    insights: string[];
  };
  delivery: {
    channels: string[];
    triggers: string[];
  };
}

export interface StrategicAnalysis {
  industryContext: string;
  valueMovement: string;
  currentPosition: string;
  targetPosition: string;
  opportunities: string[];
}

export interface DiscoveryResult {
  projectName: string;
  context: Context;
  problem: string;
  desiredOutcome: string;
  currentProcess: string[];
  availableData: string[];
  strategicAnalysis: StrategicAnalysis;
  eiidMapping: EIIDMapping;
  createdAt: string;
}
