import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * A durable audit record for one complete five-agent organisation run.
 * The identifier is generated in application code so it can be displayed
 * to a marker from the moment a run is launched.
 */
export const pipelineRuns = mysqlTable("pipelineRuns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  objective: text("objective").notNull(),
  status: mysqlEnum("status", ["queued", "running", "completed", "failed"]).notNull().default("queued"),
  activeAgent: varchar("activeAgent", { length: 32 }),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

/**
 * A structured handoff made by one agent. JSON is stored as serialised text
 * deliberately so the full artefact is easy to inspect in exported source and
 * can evolve without database migrations for each prompt iteration.
 */
export const pipelineArtifacts = mysqlTable("pipelineArtifacts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  runId: varchar("runId", { length: 64 }).notNull(),
  agentName: varchar("agentName", { length: 32 }).notNull(),
  stageOrder: int("stageOrder").notNull(),
  inputArtifactIds: text("inputArtifactIds").notNull(),
  sourceEvidence: text("sourceEvidence").notNull(),
  assumptions: text("assumptions").notNull(),
  decisionRationale: text("decisionRationale").notNull(),
  output: text("output").notNull(),
  qualityChecks: text("qualityChecks").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  index("pipelineArtifacts_runId_stageOrder_idx").on(table.runId, table.stageOrder),
]);

export type PipelineRun = typeof pipelineRuns.$inferSelect;
export type PipelineArtifact = typeof pipelineArtifacts.$inferSelect;
