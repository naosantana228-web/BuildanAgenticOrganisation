import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { pipelineArtifacts, pipelineRuns, type PipelineArtifact, type PipelineRun } from "../drizzle/schema";
import { getDb } from "./db";
import type { AgentName, StoredArtifact } from "./agents/types";

function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}

export function serialiseArtifact(row: PipelineArtifact): StoredArtifact {
  return {
    id: row.id,
    runId: row.runId,
    agentName: row.agentName as AgentName,
    stageOrder: row.stageOrder,
    inputArtifactIds: parseJson<string[]>(row.inputArtifactIds),
    sourceEvidence: parseJson<StoredArtifact["sourceEvidence"]>(row.sourceEvidence),
    assumptions: parseJson<string[]>(row.assumptions),
    decisionRationale: row.decisionRationale,
    output: parseJson<StoredArtifact["output"]>(row.output),
    qualityChecks: parseJson<string[]>(row.qualityChecks),
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createPipelineRun(objective: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection is not available");
  const id = `run_${nanoid(12)}`;
  await db.insert(pipelineRuns).values({ id, objective, status: "queued" });
  return id;
}

export async function updatePipelineRun(
  id: string,
  values: Partial<Pick<PipelineRun, "status" | "activeAgent" | "errorMessage" | "completedAt">>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database connection is not available");
  await db.update(pipelineRuns).set(values).where(eq(pipelineRuns.id, id));
}

export async function saveArtifact(artifact: Omit<StoredArtifact, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database connection is not available");
  const id = `art_${nanoid(12)}`;
  await db.insert(pipelineArtifacts).values({
    id,
    runId: artifact.runId,
    agentName: artifact.agentName,
    stageOrder: artifact.stageOrder,
    inputArtifactIds: JSON.stringify(artifact.inputArtifactIds),
    sourceEvidence: JSON.stringify(artifact.sourceEvidence),
    assumptions: JSON.stringify(artifact.assumptions),
    decisionRationale: artifact.decisionRationale,
    output: JSON.stringify(artifact.output),
    qualityChecks: JSON.stringify(artifact.qualityChecks),
  });
  return id;
}

export async function getPipelineRunWithArtifacts(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection is not available");
  const [run] = await db.select().from(pipelineRuns).where(eq(pipelineRuns.id, id)).limit(1);
  if (!run) return null;
  const artefacts = await db
    .select()
    .from(pipelineArtifacts)
    .where(eq(pipelineArtifacts.runId, id))
    .orderBy(pipelineArtifacts.stageOrder);
  return { ...run, artifacts: artefacts.map(serialiseArtifact) };
}

export async function getRecentPipelineRuns(limit = 12) {
  const db = await getDb();
  if (!db) throw new Error("Database connection is not available");
  return db.select().from(pipelineRuns).orderBy(desc(pipelineRuns.createdAt)).limit(limit);
}
