# Student Reflection Evidence Notes — Write Independently

This is a factual planning aid, not reflection prose. Use only the observations you personally witnessed or can verify in the evidence package. Write the final reflection in your own words and do not paste generated prose.

| Development observation to verify personally | Evidence available | Questions to address in your own writing |
|---|---|---|
| A public deployment initially failed because the workflow declared a pnpm version that conflicted with `package.json`. | GitHub Actions history and workflow commits. | What did this reveal about reproducible deployment configuration? How did you react and test the fix? |
| The initial public route displayed the app fallback because GitHub Pages uses the repository subpath. | GitHub commit history and the final public URL. | Why did local preview success not guarantee Pages behaviour? What routing change mattered? |
| The dashboard initially loaded but public tRPC queries stalled until the cross-origin policy permitted the client’s required headers and credentials. | `docs/verification-log.md`; final successful public run. | What did this teach you about separating a public UI from a protected API? |
| `run_AMh4qxZ2wbXJ` completed with five persisted handoffs and live source evidence. | Public dashboard screenshot and transcript. | Which traceability feature was most useful when judging whether the workflow was genuinely cumulative? |
| The Researcher distinguished release-note facts from open verification questions. | Public transcript, Researcher card. | How did this reduce the risk of unsupported claims? What still required human review? |
| The five-stage sequence introduces latency and operational complexity. | Public run timestamps and stage progression. | Where did specialisation add value, and where would you simplify or add better progress feedback? |

Before submitting, replace these notes with approximately 300 words of your own reflection and retain your own dated screenshots or development notes.
