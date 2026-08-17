import { invokeLLM, listLLMModels } from "../_core/llm";
import { getPipelineRunWithArtifacts, saveArtifact, updatePipelineRun } from "../pipelineDb";
import { AGENT_DEFINITIONS } from "./definitions";
import { fetchLiveGoogleWorkspaceUpdates } from "./liveWorkspaceFeed";
import type { AgentName, AgentOutput, SourceEvidence, StoredArtifact } from "./types";

const OUTPUT_SCHEMA = {
  type: "json_schema" as const,
  json_schema: {
    name: "agent_stage_output",
    strict: true,
    schema: {
      type: "object",
      properties: {
        executiveSummary: { type: "string" },
        decision: { type: "string" },
        deliverables: { type: "array", items: { type: "string" } },
        handoffBrief: { type: "string" },
        risks: { type: "array", items: { type: "string" } },
        confidence: { type: "string", enum: ["low", "medium", "high"] },
      },
      required: ["executiveSummary", "decision", "deliverables", "handoffBrief", "risks", "confidence"],
      additionalProperties: false,
    },
  },
};

async function chooseRuntimeModel() {
  const { data } = await listLLMModels();
  return data.find(model => model.id === "gpt-5-mini")?.id
    ?? data.find(model => model.id.startsWith("gpt-"))?.id
    ?? data[0]?.id;
}

function safeParseAgentOutput(value: string | null | undefined): AgentOutput {
  if (!value) throw new Error("The agent returned an empty response");
  const parsed = JSON.parse(value) as AgentOutput;
  if (!parsed.executiveSummary || !parsed.decision || !Array.isArray(parsed.deliverables)) {
    throw new Error("The agent response did not match the required output contract");
  }
  return parsed;
}

function buildStagePrompt(
  name: AgentName,
  objective: string,
  previousArtifacts: StoredArtifact[],
  sourceEvidence: SourceEvidence[],
) {
  const previousContext = previousArtifacts.map(artifact => ({
    id: artifact.id,
    agent: artifact.agentName,
    decision: artifact.output.decision,
    summary: artifact.output.executiveSummary,
    handoffBrief: artifact.output.handoffBrief,
    deliverables: artifact.output.deliverables,
    risks: artifact.output.risks,
  }));

  return JSON.stringify({
    organisationContext: "Google Learning Architects Policy-Change Training Response Hub",
    runObjective: objective,
    currentAgent: name,
    liveSourceEvidence: sourceEvidence,
    predecessorArtifacts: previousContext,
    operatingConstraints: [
      "Produce a focused learning-response decision, not legal advice.",
      "Do not fabricate employee data, customer quotes, adoption statistics, or product functionality.",
      "Make uncertainty explicit and provide a precise handoff to the next agent.",
      "This output will be persisted as a structured audit artefact.",
    ],
  }, null, 2);
}

async function executeAgent(
  name: AgentName,
  runId: string,
  objective: string,
  stageOrder: number,
  previousArtifacts: StoredArtifact[],
  sourceEvidence: SourceEvidence[],
) {
  const definition = AGENT_DEFINITIONS.find(agent => agent.name === name);
  if (!definition) throw new Error(`Definition missing for ${name}`);
  const model = await chooseRuntimeModel();
  const response = await invokeLLM({
    model,
    messages: [
      { role: "system", content: definition.systemPrompt },
      { role: "user", content: buildStagePrompt(name, objective, previousArtifacts, sourceEvidence) },
    ],
    response_format: OUTPUT_SCHEMA,
  });
  const responseContent = response.choices[0]?.message?.content;
  const output = safeParseAgentOutput(typeof responseContent === "string" ? responseContent : null);
  const assumptions = [
    "The public release note is an authoritative signal but must be validated with the responsible product owner before organisational action.",
    "This educational prototype does not process real employee personal data.",
  ];
  const qualityChecks = [
    "Server-side runtime LLM call completed with a strict JSON-schema response.",
    previousArtifacts.length === 0
      ? "Researcher stage received live external source evidence fetched at run time."
      : `Received and used predecessor artefact IDs: ${previousArtifacts.map(artifact => artifact.id).join(", ")}.`,
    "Output contains the required summary, decision, deliverables, handoff brief, risks, and confidence fields.",
  ];
  const baseArtifact = {
    runId,
    agentName: name,
    stageOrder,
    inputArtifactIds: previousArtifacts.map(artifact => artifact.id),
    sourceEvidence,
    assumptions,
    decisionRationale: output.decision,
    output,
    qualityChecks,
  } satisfies Omit<StoredArtifact, "id" | "createdAt">;
  const id = await saveArtifact(baseArtifact);
  return { ...baseArtifact, id, createdAt: new Date().toISOString() } satisfies StoredArtifact;
}

/**
 * Runs exactly five specialised agents in sequence. Each database artefact is
 * committed before the next LLM request begins, so the dashboard can poll and
 * render a traceable live progress view while the request is still executing.
 */
export async function executePipeline(runId: string) {
  const run = await getPipelineRunWithArtifacts(runId);
  if (!run) throw new Error(`Run ${runId} was not found`);
  if (run.status === "completed") return run;

  await updatePipelineRun(runId, { status: "running", activeAgent: "Researcher", errorMessage: null });
  const persistedArtifacts: StoredArtifact[] = [];

  try {
    // The actual external tool/data request happens immediately before Researcher reasoning.
    const liveEvidence = await fetchLiveGoogleWorkspaceUpdates();
    for (let index = 0; index < AGENT_DEFINITIONS.length; index += 1) {
      const definition = AGENT_DEFINITIONS[index];
      await updatePipelineRun(runId, { status: "running", activeAgent: definition.name });
      const artifact = await executeAgent(
        definition.name,
        runId,
        run.objective,
        index + 1,
        persistedArtifacts,
        [liveEvidence],
      );
      persistedArtifacts.push(artifact);
    }
    await updatePipelineRun(runId, { status: "completed", activeAgent: null, completedAt: new Date() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown pipeline error occurred";
    await updatePipelineRun(runId, { status: "failed", errorMessage: message, activeAgent: null });
    throw error;
  }

  return getPipelineRunWithArtifacts(runId);
}
