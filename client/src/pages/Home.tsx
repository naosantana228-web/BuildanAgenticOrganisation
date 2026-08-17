import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  CircleDotDashed,
  ClipboardCheck,
  Clock3,
  Copy,
  DatabaseZap,
  ExternalLink,
  Eye,
  FileSearch,
  Loader2,
  Network,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const DEFAULT_OBJECTIVE = "Analyse the latest Google Workspace product update and produce a focused, human-reviewed training response for affected employees and managers.";
const STAGE_ICONS = [FileSearch, Sparkles, DatabaseZap, Network, ClipboardCheck];

type RunStatus = "queued" | "running" | "completed" | "failed";

function formatTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function readableStatus(status: RunStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function CopyRunId({ runId }: { runId: string }) {
  return (
    <button
      className="run-id"
      onClick={() => {
        navigator.clipboard.writeText(runId);
        toast.success("Run identifier copied");
      }}
      title="Copy run identifier"
    >
      <span>{runId}</span>
      <Copy size={14} aria-hidden="true" />
    </button>
  );
}

export default function Home() {
  const [objective, setObjective] = useState(DEFAULT_OBJECTIVE);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [view, setView] = useState<"dashboard" | "agents">("dashboard");
  const [expandedArtifacts, setExpandedArtifacts] = useState<Record<string, boolean>>({});
  const utils = trpc.useUtils();
  const agents = trpc.agents.list.useQuery();
  const runs = trpc.pipeline.recent.useQuery(undefined, { refetchInterval: 15000 });
  const selectedRun = trpc.pipeline.get.useQuery(
    { runId: selectedRunId ?? "pending" },
    { enabled: Boolean(selectedRunId), refetchInterval: 1500 },
  );
  const createRun = trpc.pipeline.create.useMutation({
    onSuccess: async data => {
      setSelectedRunId(data);
      await utils.pipeline.recent.invalidate();
      executeRun.mutate({ runId: data });
    },
    onError: error => toast.error(error.message),
  });
  const executeRun = trpc.pipeline.execute.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.pipeline.get.invalidate(), utils.pipeline.recent.invalidate()]);
      toast.success("Five-agent organisation run completed");
    },
    onError: error => {
      toast.error("The pipeline stopped. Inspect the run detail for the audit error.");
      console.error(error);
      utils.pipeline.get.invalidate();
      utils.pipeline.recent.invalidate();
    },
  });

  const run = selectedRun.data;
  const isBusy = createRun.isPending || executeRun.isPending || run?.status === "running";
  const completedCount = run?.artifacts.length ?? 0;
  const progressLabel = run?.status === "completed" ? "Organisation completed" : run?.activeAgent ? `${run.activeAgent} is working` : "Ready to launch";

  useEffect(() => {
    if (!selectedRunId && runs.data?.[0]?.id) setSelectedRunId(runs.data[0].id);
  }, [runs.data, selectedRunId]);

  const stageStates = useMemo(() => {
    return (agents.data ?? []).map((agent, index) => {
      const artifact = run?.artifacts.find(item => item.agentName === agent.name);
      if (artifact) return { status: "complete" as const, artifact, index };
      if (run?.status === "running" && run.activeAgent === agent.name) return { status: "active" as const, index };
      if (run?.status === "failed" && run.activeAgent === agent.name) return { status: "failed" as const, index };
      return { status: "waiting" as const, index };
    });
  }, [agents.data, run]);

  const retryAgents = () => agents.refetch();
  const retryRuns = () => runs.refetch();
  const retrySelectedRun = () => selectedRun.refetch();

  const startRun = () => {
    if (objective.trim().length < 20) {
      toast.error("Please provide a more specific run objective (at least 20 characters).");
      return;
    }
    createRun.mutate({ objective: objective.trim() });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Learning Architects home">
          <span className="brand-mark"><Workflow size={19} /></span>
          <span>Learning Architects<span className="brand-muted">/</span>Signal</span>
        </a>
        <nav className="main-nav" aria-label="Primary navigation">
          <button className={view === "dashboard" ? "nav-active" : ""} onClick={() => setView("dashboard")}>Command centre</button>
          <button className={view === "agents" ? "nav-active" : ""} onClick={() => setView("agents")}>Agent design</button>
        </nav>
        <div className="header-proof"><ShieldCheck size={16} /> Server-side AI · auditable handoffs</div>
      </header>

      <main id="top" className="page-wrap">
        {view === "dashboard" ? (
          <>
            <section className="hero-grid" aria-labelledby="page-title">
              <div>
                <p className="eyebrow"><span></span>Policy-change learning response</p>
                <h1 id="page-title">Turn live product change into <em>confident adoption.</em></h1>
                <p className="hero-copy">A traceable organisation of five specialist AI agents that interprets a current Google Workspace release signal, designs a response, builds a practical artefact, activates stakeholders, and provides an executive rollout plan.</p>
              </div>
              <aside className="integrity-card" aria-label="System integrity guarantees">
                <div className="integrity-heading"><ShieldCheck size={18} /> Assessment evidence</div>
                <p>Every stage persists its structured input, decision, source evidence, checks, and timestamp under one visible run identifier.</p>
                <div className="integrity-row"><DatabaseZap size={15} /><span>Live external source at run time</span></div>
                <div className="integrity-row"><Bot size={15} /><span>Five server-side LLM calls</span></div>
                <div className="integrity-row"><Eye size={15} /><span>Marker-readable audit trail</span></div>
              </aside>
            </section>

            <section className="launch-panel" aria-labelledby="launch-title">
              <div className="launch-heading">
                <p className="section-kicker">New organisation run</p>
                <h2 id="launch-title">Set the response objective</h2>
              </div>
              <div className="launch-form">
                <Textarea
                  aria-label="Pipeline objective"
                  value={objective}
                  onChange={event => setObjective(event.target.value)}
                  className="objective-input"
                />
                <Button className="launch-button" onClick={startRun} disabled={isBusy}>
                  {isBusy ? <Loader2 className="spin" size={17} /> : <Play size={17} fill="currentColor" />}
                  {isBusy ? "Running organisation" : "Launch five agents"}
                </Button>
              </div>
              <p className="launch-note"><CircleDotDashed size={14} /> The Researcher makes a new request to the official Google Workspace release-notes feed immediately before its analysis. No release-note fixture is used.</p>
            </section>

            <section className="workflow-section" aria-labelledby="workflow-title">
              <div className="section-header">
                <div>
                  <p className="section-kicker">Live orchestration</p>
                  <h2 id="workflow-title">Pipeline status</h2>
                </div>
                {run ? (
                  <div className={`status-pill status-${run.status}`}><span></span>{readableStatus(run.status)} · {progressLabel}</div>
                ) : <div className="status-pill status-queued"><span></span>Awaiting first run</div>}
              </div>

              <div className="stepper" aria-label="Five-stage pipeline progress">
                {agents.isLoading && <PipelineLoading />}
                {agents.isError && <QueryError label="The five-agent architecture" detail="The agent definitions could not be loaded." onRetry={retryAgents} />}
                {!agents.isLoading && !agents.isError && (agents.data ?? []).map((agent, index) => {
                  const stage = stageStates[index];
                  const Icon = STAGE_ICONS[index];
                  return (
                    <div key={agent.name} className={`step ${stage?.status ?? "waiting"}`}>
                      <div className="step-line" aria-hidden="true"></div>
                      <div className="step-marker">{stage?.status === "complete" ? <Check size={16} /> : stage?.status === "active" ? <Loader2 className="spin" size={16} /> : <Icon size={16} />}</div>
                      <div className="step-copy"><span>{String(index + 1).padStart(2, "0")}</span><strong>{agent.name}</strong><small>{agent.archetype}</small></div>
                    </div>
                  );
                })}
              </div>
              {run && (
                <div className="run-meta">
                  <div><span>Audit run</span><CopyRunId runId={run.id} /></div>
                  <div><span>Started</span><strong>{formatTime(run.createdAt)}</strong></div>
                  <div><span>Artefacts</span><strong>{completedCount} / 5 persisted</strong></div>
                  <div><span>Source strategy</span><strong>Fresh runtime RSS request</strong></div>
                </div>
              )}
              {run?.errorMessage && <div className="error-banner"><AlertTriangle size={17} /><span><strong>Run halted:</strong> {run.errorMessage}</span></div>}
            </section>

            <section className="run-content-grid" aria-label="Pipeline artefacts and run history">
              <div className="artifact-panel">
                <div className="section-header compact">
                  <div><p className="section-kicker">Structured handoffs</p><h2>Decision trail</h2></div>
                  {run ? <span className="counter">{completedCount} artefacts</span> : null}
                </div>
                {selectedRun.isLoading && selectedRunId && <DetailLoading />}
                {selectedRun.isError && <QueryError label="This audit run" detail="Its persisted handoffs could not be loaded." onRetry={retrySelectedRun} />}
                {!run && !selectedRun.isLoading && !selectedRun.isError && <EmptyState />}
                {run?.artifacts.map((artifact, index) => {
                  const expanded = expandedArtifacts[artifact.id] ?? index === 0;
                  const definition = agents.data?.find(agent => agent.name === artifact.agentName);
                  const Icon = STAGE_ICONS[index];
                  return (
                    <article className="artifact-card" key={artifact.id}>
                      <button className="artifact-summary" onClick={() => setExpandedArtifacts(previous => ({ ...previous, [artifact.id]: !expanded }))} aria-expanded={expanded}>
                        <div className="artifact-ident"><span className="agent-orb"><Icon size={16} /></span><div><span className="stage-label">Stage {String(artifact.stageOrder).padStart(2, "0")}</span><h3>{artifact.agentName}</h3><p>{definition?.purpose}</p></div></div>
                        <div className="artifact-state"><span>{formatTime(artifact.createdAt)}</span><ChevronDown size={18} className={expanded ? "chevron-up" : ""} /></div>
                      </button>
                      {expanded && <ArtifactDetail artifact={artifact} />}
                    </article>
                  );
                })}
                {run?.status === "running" && completedCount < 5 && <div className="awaiting-card"><Loader2 size={17} className="spin" /> The next committed handoff will appear here as soon as the agent completes.</div>}
              </div>

              <aside className="history-panel">
                <div className="section-header compact"><div><p className="section-kicker">Run register</p><h2>Recent audit runs</h2></div><button className="refresh-button" onClick={() => runs.refetch()} aria-label="Refresh run history"><RefreshCw size={16} /></button></div>
                <div className="history-list">
                  {runs.isLoading && <HistoryLoading />}
                  {runs.isError && <QueryError label="Run history" detail="The run register could not be loaded." onRetry={retryRuns} compact />}
                  {!runs.isLoading && !runs.isError && (runs.data ?? []).length === 0 && <p className="empty-history">The first run will appear here.</p>}
                  {!runs.isLoading && !runs.isError && (runs.data ?? []).map(item => (
                    <button key={item.id} className={`history-item ${item.id === selectedRunId ? "selected" : ""}`} onClick={() => setSelectedRunId(item.id)}>
                      <span className={`history-dot ${item.status}`}></span>
                      <span className="history-copy"><strong>{item.objective}</strong><small>{item.id} · {formatTime(item.createdAt)}</small></span>
                      <ArrowRight size={15} />
                    </button>
                  ))}
                </div>
                <div className="live-source-note"><ExternalLink size={15} /><div><strong>Live source</strong><p>Official Google Workspace developer release notes feed. Each run records its exact fresh request and returned items.</p><a href="https://developers.google.com/workspace/release-notes" target="_blank" rel="noreferrer">Verify source <ArrowRight size={12} /></a></div></div>
              </aside>
            </section>
          </>
        ) : (
          <AgentDesignView agents={agents.data ?? []} />
        )}
      </main>
      <footer className="site-footer"><span>Learning Architects / Signal — agentic organisation prototype</span><span>Built for transparent learning-change decisions</span></footer>
    </div>
  );
}

function EmptyState() {
  return <div className="empty-state"><span><Workflow size={22} /></span><h3>No decision trail yet</h3><p>Launch the organisation to fetch a live Workspace update and create five traceable specialist handoffs.</p></div>;
}

function QueryError({ label, detail, onRetry, compact = false }: { label: string; detail: string; onRetry: () => void; compact?: boolean }) {
  return <div className={`query-error ${compact ? "compact-error" : ""}`} role="alert"><AlertTriangle size={compact ? 15 : 19} /><div><strong>{label} is unavailable</strong><p>{detail} Check the protected API connection, then retry.</p><button onClick={onRetry}><RefreshCw size={13} /> Retry request</button></div></div>;
}

function PipelineLoading() {
  return <div className="pipeline-loading" role="status" aria-live="polite"><Loader2 className="spin" size={18} /> Loading the five-agent architecture…</div>;
}

function DetailLoading() {
  return <div className="detail-loading" role="status" aria-live="polite"><Loader2 className="spin" size={19} /><span>Loading persisted handoffs for this audit run…</span></div>;
}

function HistoryLoading() {
  return <div className="history-loading" role="status" aria-live="polite"><Loader2 className="spin" size={15} /> Loading run register…</div>;
}

function ArtifactDetail({ artifact }: { artifact: any }) {
  const source = artifact.sourceEvidence?.[0];
  return (
    <div className="artifact-detail">
      <div className="output-block"><span className="detail-label">Executive summary</span><p>{artifact.output.executiveSummary}</p></div>
      <div className="two-up"><div className="detail-card"><span className="detail-label">Decision rationale</span><p>{artifact.decisionRationale}</p></div><div className="detail-card"><span className="detail-label">Confidence</span><p className="confidence">{artifact.output.confidence}</p></div></div>
      <div className="two-up"><div className="detail-card"><span className="detail-label">Deliverables</span><ul>{artifact.output.deliverables.map((item: string) => <li key={item}>{item}</li>)}</ul></div><div className="detail-card"><span className="detail-label">Quality checks</span><ul>{artifact.qualityChecks.map((item: string) => <li key={item}>{item}</li>)}</ul></div></div>
      <div className="handoff-block"><span className="detail-label">Handoff to next stage</span><p>{artifact.output.handoffBrief}</p><small>Input artefacts: {artifact.inputArtifactIds.length ? artifact.inputArtifactIds.join(", ") : "Live source evidence only — first stage"}</small></div>
      {source && <div className="source-block"><div><span className="detail-label">Runtime source evidence</span><strong>{source.sourceName}</strong><p>Fetched {formatTime(source.fetchedAt)} · HTTP {source.httpStatus}</p></div><a href={source.sourceUrl} target="_blank" rel="noreferrer" aria-label="Open exact live source request"><ExternalLink size={17} /></a><div className="source-items">{source.items.map((item: any) => <a key={`${item.title}-${item.publishedAt}`} href={item.link} target="_blank" rel="noreferrer"><strong>{item.title}</strong><span>{item.publishedAt}</span><p>{item.summary}</p></a>)}</div></div>}
    </div>
  );
}

function AgentDesignView({ agents }: { agents: any[] }) {
  return <section className="agent-design-view"><div className="agent-design-hero"><p className="eyebrow"><span></span>Submission evidence</p><h1>Five distinct roles. <em>One cumulative organisation.</em></h1><p>Each specialist uses a full system prompt, a discrete operating lens, and a structured output contract. The public pipeline makes the handoff between these roles visible rather than treating them as five independent chatbots.</p></div><div className="agent-design-grid">{agents.map((agent, index) => { const Icon = STAGE_ICONS[index]; return <article className="design-card" key={agent.name}><div className="design-top"><span className="agent-orb"><Icon size={18} /></span><span className="stage-label">0{index + 1} / {agent.archetype}</span></div><h2>{agent.name}</h2><p className="personality">{agent.personality}</p><div className="design-section"><span>Domain expertise</span><p>{agent.expertise}</p></div><div className="design-section"><span>Purpose</span><p>{agent.purpose}</p></div><details><summary>View full system prompt <ChevronDown size={16} /></summary><pre>{agent.systemPrompt}</pre></details><div className="example-output"><span>Example structured output</span><p><strong>Decision:</strong> {agent.exampleOutput.decision}</p><p><strong>Handoff:</strong> {agent.exampleOutput.handoffBrief}</p></div></article>})}</div></section>;
}
