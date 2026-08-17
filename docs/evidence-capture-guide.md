# Marker Evidence Capture Guide

Capture the following evidence after a successful fresh run. Use the exact visible run ID in the filenames and report captions so the written document, screenshots, codebase, and public interface form one auditable set.

| Evidence item | Capture method | What it proves |
|---|---|---|
| Public landing dashboard | Full browser screenshot showing the URL and public page. | A polished, browser-accessible working prototype. |
| Fresh run launch | Screenshot of the objective and “Launch five agents” action. | A user can trigger a new organisation run. |
| Visible run ID and progress | Screenshot while the pipeline is active. | Auditability and sequential orchestration rather than independent chatbots. |
| Researcher runtime evidence | Expand the Researcher card and capture source name, fresh URL, timestamp, HTTP status, and returned entries. | Mandatory live external data query at time of use. |
| Five structured handoffs | Capture each expanded stage, including input artefact IDs, decision, deliverables, quality checks, and handoff brief. | Cumulative outputs passed from Researcher to Manager. |
| Manager executive synthesis | Expand the final Manager card. | Strategic operational plan made from all prior work. |
| Agent Design page | Screenshot each system-prompt disclosure, personality, expertise, and example output. | Five differentiated agent architectures. |
| Source-code evidence | Screenshot `fetchLiveGoogleWorkspaceUpdates()` and the `executePipeline()` call sequence. | Code confirms live fetch and server-side orchestration. |
| Security evidence | Screenshot `.gitignore`, configuration documentation, and server-side `invokeLLM` import. | Secrets are not committed or exposed to the client. |
| Deployment evidence | Screenshot the public GitHub Pages URL after configuration, plus its GitHub Actions completion page. | Required public URL is reachable. |

## Suggested caption style

Use captions that make a single claim and name the proof, for example:

> **Figure 3. Researcher live-data evidence.** Run `run_[replace]` fetched the official Google Workspace developer release-notes feed at `[replace time]`; the card records the fresh request URL, HTTP response, and three returned source items before Researcher reasoning.

Avoid screenshots that expose API keys, database URLs, session cookies, personal data, or irrelevant browser tabs. Preserve a short screen recording of one full run if practical, even though the written submission will primarily use screenshots and selected transcripts.
