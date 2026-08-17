# Protected Runtime Dependency Boundary

The public GitHub Pages application is a static React dashboard. It does not carry model credentials, user-session forwarding, authentication controls, or server-only API integrations. The unused public-client login and dashboard scaffold files were removed as part of the portability cleanup.

The following files remain because they provide functional server capabilities for the deployed prototype and are not presentation-layer scaffolding:

| Area | Required files | Reason retained |
|---|---|---|
| tRPC request handling | `server/_core/index.ts`, `server/_core/trpc.ts`, `server/_core/context.ts` | Hosts the protected API, public route contracts, and cross-origin policy used by GitHub Pages. |
| Runtime LLM service | `server/_core/llm.ts`, `server/agents/pipelineService.ts` | Keeps model access and credentials server-side while executing the five specialised agent stages. |
| Persistent audit data | `drizzle/schema.ts`, `server/pipelineDb.ts` | Stores runs and structured handoff artefacts used by the marker-facing audit trail. |
| Live external source | `server/agents/liveWorkspaceFeed.ts` | Retrieves the fresh official Google Workspace update source during the Researcher stage. |
| Operational foundation | `server/_core/sdk.ts`, `server/_core/types/`, related utility modules | Provides the deployed server runtime contracts used by the protected API. |

These server-side bindings are intentionally retained because removing or disguising them would stop the live deployed workflow from functioning or misrepresent the implementation. The separate AI-use ledger and student-authored reflection guidance are retained to support the assignment’s disclosure requirements.
