# AI-Use Ledger

This ledger supports the assignment requirement to disclose AI-generated content. The final public validation run was `run_AMh4qxZ2wbXJ` on 17 August 2026. Complete the final **model/version and human verification** fields for each submission run, because the server selects an available runtime model from the live catalogue.

| Item | Model/tool | Prompt or source location | AI-assisted purpose | Human verification required |
|---|---|---|---|---|
| Researcher stage | Server-side runtime LLM | `server/agents/definitions.ts`, `Researcher.systemPrompt` | Interpret a fresh public Workspace update and identify a training opportunity. | Check release note accuracy, separate facts/assumptions, and validate product relevance with a subject-matter owner. |
| Designer stage | Server-side runtime LLM | `Designer.systemPrompt` | Create a human-centred learning solution specification from the Researcher artefact. | Check feasibility, accessibility, and traceability to research. |
| Maker stage | Server-side runtime LLM | `Maker.systemPrompt` | Produce the working-prototype scope, acceptance criteria, and test framing. | Verify implementation claims against the actual repository and test results. |
| Communicator stage | Server-side runtime LLM | `Communicator.systemPrompt` | Draft accurate adoption communications grounded in actual preceding artefacts. | Remove unsupported claims; review audience appropriateness and clarity. |
| Manager stage | Server-side runtime LLM | `Manager.systemPrompt` | Synthesise an executive rollout plan, KPIs, and risk register. | Apply human approval before action; review risk and legal statements. |
| Report draft | Generative AI drafting assistance | `docs/submission-report-draft.md` | Structure and draft descriptive assessment material from the implemented system. | Rewrite for accuracy, insert actual evidence/run ID, verify all sources, and personalise the academic voice. |

## Runtime prompt context

Each stage is given the run objective, the current agent identity, the live source evidence, all predecessor artefact identifiers and summaries, and these operating constraints: do not fabricate employee data, quotes, adoption statistics, or functionality; state uncertainty; and create a precise handoff for the next agent. The output is constrained to a strict JSON schema with `executiveSummary`, `decision`, `deliverables`, `handoffBrief`, `risks`, and `confidence`.

## Student disclosure checklist

Before submission, replace this section with a concise first-person disclosure that lists the model shown in the run evidence, the five system prompts or their file locations, the report-drafting assistance used, and the specific human verification completed. Do **not** state that any unverified AI output was accepted. The final reflection is intentionally excluded from this ledger because it must be personally authored.
