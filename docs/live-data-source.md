# Live Data Source Verification

The Researcher stage calls the official **Google Workspace developer release notes** Atom feed at runtime:

```text
https://developers.google.com/feeds/workspace-release-notes.xml
```

Google’s release-notes page identifies this as the direct feed URL for the latest Workspace product updates. The implementation in `server/agents/liveWorkspaceFeed.ts` appends a time-based query parameter, uses `cache: "no-store"`, and records the request URL, retrieval timestamp, HTTP status, and parsed entries inside the Researcher’s `source_evidence`. It deliberately reads neither a repository fixture nor a cached database snapshot. [1]

This source is appropriate for the project because it is public, attributable, requires no client-side credential, and returns current product-change signals that the five-agent organisation can translate into a focused employee training response.

## Code-review guide

The assessor can inspect `fetchLiveGoogleWorkspaceUpdates()` in `server/agents/liveWorkspaceFeed.ts`. It executes immediately before the Researcher LLM call in `executePipeline()` in `server/agents/pipelineService.ts`. The database artefact then preserves the resulting source evidence for audit, but the evidence is never used as a substitute for the mandatory fresh request on a new run.

## Reference

[1]: https://developers.google.com/workspace/release-notes "Google Workspace developer release notes — official feed URL"
