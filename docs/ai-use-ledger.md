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


| Student-completed field | What to enter after your own check |
|---|---|
| Model and version | The exact model/version shown by your verified final runtime evidence. Do not infer it from a model-selection fallback in source code. |
| Date and final run | `17 August 2026` and `run_AMh4qxZ2wbXJ`, if this remains the run you submit as evidence. |
| Prompt locations | `server/agents/definitions.ts` and the five public Agent Design prompt panels. |
| Report assistance disclosure | A truthful short description of drafting/formatting assistance and the report sections where it was used. |
| Personal verification | Only checks you personally performed, for example opening the public URL, comparing Figures 1–3, checking the live source link, and verifying the cited regulations. |
| Reflection statement | Confirm only that the reflection was written independently in your own words. |

## My final disclosure notes

- Final evidence run: `run_AMh4qxZ2wbXJ` on 17 August 2026.
- Model/version: Server-side runtime LLM; the exact model version was dynamically selected by the protected service and was not persisted in the submitted run artifact
- Prompt locations: `server/agents/definitions.ts` and the public Agent Design view.
- Assistance used: AI assistance was used to support the multi-agent system design, prompt development, implementation, documentation, report formatting, evidence organisation, and citation review. The final report includes the public deployment URL, run evidence, figures, and a separate AI-use disclosure.
- My verification: I reviewed the public GitHub Pages URL, the completed run evidence and figures, the code archive contents, and the cited source links. I did not independently rerun the full automated test suite before submission.
- Reflection: I wrote the reflection independently in my own words.

