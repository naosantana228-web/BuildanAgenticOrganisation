export const AGENT_NAMES = ["Researcher", "Designer", "Maker", "Communicator", "Manager"] as const;

export type AgentName = (typeof AGENT_NAMES)[number];

export type SourceEvidence = {
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  httpStatus: number;
  items: Array<{
    title: string;
    publishedAt: string;
    summary: string;
    link: string;
  }>;
};

export type AgentOutput = {
  executiveSummary: string;
  decision: string;
  deliverables: string[];
  handoffBrief: string;
  risks: string[];
  confidence: "low" | "medium" | "high";
};

export type StoredArtifact = {
  id: string;
  runId: string;
  agentName: AgentName;
  stageOrder: number;
  inputArtifactIds: string[];
  sourceEvidence: SourceEvidence[];
  assumptions: string[];
  decisionRationale: string;
  output: AgentOutput;
  qualityChecks: string[];
  createdAt: string;
};
