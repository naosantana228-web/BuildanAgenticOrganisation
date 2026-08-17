# Building an Agentic Organisation: Learning Architects / Signal

**Student:** [replace with your name]<br>
**Student number:** [replace if required]<br>
**Module:** H9CEAI — Customer Engagement and Artificial Intelligence<br>
**Submission date:** 17 August 2026<br>
**Runtime model/version:** [replace after checking your verified run evidence]<br>
**Working prototype:** `https://naosantana228-web.github.io/BuildanAgenticOrganisation/`
**Example run ID:** `run_AMh4qxZ2wbXJ` — completed publicly on 17 August 2026 with five persisted audit artifacts.

> **Draft-status note.** This document is AI-assisted drafting material. Before submission, verify every factual claim, replace bracketed fields with actual evidence, disclose the model/prompts used in the AI-use ledger, and personally write the Reflection section without generative AI.

## 1. Your Organisation

Learning Architects / Signal is a fictional Google Learning Architects service that helps employees and people managers respond to product or policy changes that alter how they work in Google Workspace. The chosen challenge is not simply informing users that a change has occurred. It is turning an externally published, frequently technical product update into a timely, role-specific and trustworthy training response. Employees need to know what has changed, whether it affects their team, what action is required, and where to obtain support. Managers need a reliable view of priority, risk, readiness, and evidence of adoption.

This challenge benefits from an agentic approach because its work contains distinct but dependent forms of judgement. A Researcher must retrieve and interpret a fresh public signal; a Designer must turn the evidence into a usable learning experience; a Maker must translate the design into a functional artifact; a Communicator must explain the actual capability without exaggeration; and a Manager must reconcile the full chain into governed next actions. A single generic chatbot could produce a plausible summary, but it would not provide the same traceability, specialist role separation, or auditable sequence of decisions.

The organisation uses the official Google Workspace developer release-notes Atom feed as its external source. Google identifies `https://developers.google.com/feeds/workspace-release-notes.xml` as the direct feed URL for current Workspace updates. [1] On each new run, the system makes a fresh no-store server request before Researcher reasoning, rather than relying on a repository fixture or cached release-note value. The resulting source URL, retrieval time, HTTP status, and returned entries are retained as evidence in the first handoff artifact.

## 2. Agent Designs

The organisation contains exactly five specialised agents. Each uses a distinct personality, expertise profile, full system prompt, and structured output contract. All stages return `executiveSummary`, `decision`, `deliverables`, `handoffBrief`, `risks`, and `confidence` under strict JSON-schema validation. The accompanying prototype exposes the complete full prompts in its **Agent Design** page.

### Researcher — Opportunity Intelligence

**Role and output:** The Researcher is evidence-led, careful, and explicit about uncertainty. It analyses a fresh Google Workspace update and produces an evidence-backed training opportunity brief, including affected audience hypotheses, uncertainty, and a recommended next design question.

**Full system prompt:**

> You are the Researcher in Google Learning Architects' Policy-Change Training Response Hub. You are an evidence-first market and policy analyst. Your job is to interpret only the live source evidence provided in this run, identify the learning or adoption problem it creates, and propose a focused opportunity for internal Google Workspace users. Separate facts from assumptions. Do not invent statistics, product behaviour, customer quotes, or policy obligations. Your output must help a Designer make a practical learning decision. Prefer a narrow, auditable training opportunity over broad transformation language.

### Designer — Human-Centred Solution Design

**Role and output:** The Designer is empathetic, structured, and disciplined about user needs. It receives the Researcher artifact and produces a learning journey, audience/need definition, acceptance criteria, accessibility considerations, and a bounded prototype specification.

**Full system prompt:**

> You are the Designer in Google Learning Architects' Policy-Change Training Response Hub. You are a human-centred learning-experience designer. Consume the Researcher's evidence-backed opportunity brief and convert it into a clear, accessible solution specification. Make choices that trace directly to the research. Define audience, moment of need, learning objective, experience flow, acceptance criteria, and accessibility considerations. Never add functionality or claims that are absent from the prior handoff. Your output must be specific enough for a Maker to build a limited but genuine prototype.

### Maker — Technical Craftsmanship

**Role and output:** The Maker is pragmatic, precise, and test-minded. It consumes the design specification and defines the working artifact, implemented acceptance criteria, test scenarios, constraints, and an accurate description of the system’s capabilities.

**Full system prompt:**

> You are the Maker in Google Learning Architects' Policy-Change Training Response Hub. You are a pragmatic product engineer. Translate the Designer's specification into a small, testable working artefact. Explain which acceptance criteria are implemented, how users interact with the result, and what constraints remain. Preserve traceability to the live source and preceding decisions. Do not claim that a feature works unless it is represented by a real implementation approach in the handoff context. Your output must give the Communicator accurate material to describe.

### Communicator — Persuasion and Storytelling

**Role and output:** The Communicator is clear, audience-aware, and candid. It uses the actual Maker artifact and upstream evidence to create an employee/manager change-activation plan, including a message hierarchy, calls to action, and practical measurement ideas.

**Full system prompt:**

> You are the Communicator in Google Learning Architects' Policy-Change Training Response Hub. You are a change-communications strategist. Use the actual Maker artefact and the upstream evidence to craft clear, accurate communications for employees, people managers, and learning stakeholders. Explain why the change matters, what users should do, and how help is available. Avoid fabricated testimonials, inflated adoption claims, or unsupported promises. Your output must give the Manager a credible activation plan and measurable communication actions.

### Manager — Leadership and Orchestration

**Role and output:** The Manager is strategic, accountable, and action-oriented. It receives all preceding artifacts and produces the final executive plan, KPI suggestions, risk register, and a human-review checkpoint before any real training policy is enacted.

**Full system prompt:**

> You are the Manager in Google Learning Architects' Policy-Change Training Response Hub. You are an accountable learning-operations leader. Review the complete chain of Researcher, Designer, Maker, and Communicator artefacts. Produce a concise executive operational plan that protects strategic alignment, acknowledges uncertainty, and sets a human review checkpoint before any real training policy is enacted. Connect decisions to evidence, define measurable next steps, and surface legal, trust, accessibility, and operational risks. Do not overwrite prior specialist work; reconcile it into a coherent plan.

## 3. The Pipeline in Action

The system executes the chain **Researcher → Designer → Maker → Communicator → Manager**. When a user launches a run, the server creates a visible `run_id` and then calls the live Google Workspace feed. The Researcher receives only that source evidence and the user’s objective. Once its strict JSON result is validated, the system persists it as an artifact and passes its identifier, decision, summary, deliverables, handoff brief, and risks to the Designer. This continues cumulatively through each specialist. The Manager receives the four previous artifacts and produces a final executive synthesis.

Each database record contains `run_id`, `agent_name`, `input_artifact_ids`, `source_evidence`, `assumptions`, `decision_rationale`, `output`, `quality_checks`, and `created_at`. This prevents the system from appearing as five isolated chatbot conversations. The dashboard presents a real-time five-step progress bar, a copyable run ID, status indicators, source evidence, the previous artifact IDs, decision trail, and collapsible output cards. **Insert Figure 1: completed Command Centre run. Insert Figure 2a: Researcher and Designer profiles. Insert Figure 2b: Maker, Communicator, and Manager profiles. Insert optional Figure 3: expanded Researcher live-source evidence.**

For the captured public test run `run_AMh4qxZ2wbXJ`, the database stored a completed run and five structured artifacts. The public dashboard showed the freshly retrieved source URL, HTTP 200 status, source retrieval timestamp, all five completed stages, and the final persisted Manager handoff. The dynamic retrieval code is in `fetchLiveGoogleWorkspaceUpdates()` and is called immediately before the Researcher LLM invocation. The automated tests additionally check that the function uses `cache: "no-store"`, includes a fresh timestamp parameter, returns parsed feed entries, and fails transparently if the live request returns an error.

## 4. GitHub Pages URL

The intended public URL is:

```text
https://naosantana228-web.github.io/BuildanAgenticOrganisation/
```

**Before submitting, verify this link is accessible without login, that `client/public/config.js` references the protected API, and that a fresh run succeeds in an external browser.** GitHub Pages hosts the public React interface. The server-side API is hosted separately so its database and LLM credentials remain protected; the browser only receives the public API address and never a secret key.

## 5. Regulatory and Ethical Considerations

The prototype should be presented transparently as an AI-assisted learning-response system. Article 50(1) of the EU AI Act requires providers of AI systems intended to interact directly with natural persons to design the system so people are informed that they are interacting with AI, unless this is obvious in context. [2] The dashboard therefore describes itself as a five-agent AI organisation, shows agent names and status, retains source provenance, and includes a human-review condition in the Manager’s prompt. Although this prototype is not designed to make employment, promotion, admission, or other Annex III high-risk decisions, this classification must be re-evaluated if it is expanded to profile or make consequential decisions about individual workers. Annex III identifies high-risk areas under Article 6(2), including particular employment-related uses. [2]

If real training requests include employee names, roles, performance context, or other personal information, the controller must apply GDPR principles including lawfulness, fairness and transparency, purpose limitation, and data minimisation under Article 5. [3] At collection, users should be told the controller’s identity, purposes, processing context, and relevant rights in line with Article 13. [3] The prototype avoids using real employee data in its sample run; production implementation would require access controls, a documented retention period, human escalation, data-protection review, and a clear distinction between training support and employment evaluation. Trust also depends on showing source evidence, acknowledging uncertainty, avoiding fabricated claims, and ensuring that a responsible human validates the policy interpretation before action.

## 6. Reflection — Student-authored only

Write approximately 300 words in your own words. Do not use generative AI for this section. Use [`reflection-student-only.md`](reflection-student-only.md) as a question guide and base the final prose on your own development diary, prompt changes, failed/successful runs, evidence capture, and observations.

## References

[1]: https://developers.google.com/workspace/release-notes "Google Workspace developer release notes"

[2]: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng "Regulation (EU) 2024/1689 (Artificial Intelligence Act), Article 50 and Annex III"

[3]: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng "Regulation (EU) 2016/679 (GDPR), Articles 5 and 13"
