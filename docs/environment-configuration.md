# Environment Configuration and Secret Safety

This project uses the hosting platform's server-only environment injection for the database, authentication, and built-in LLM credentials. The browser never receives `BUILT_IN_FORGE_API_KEY`, `BUILT_IN_FORGE_API_URL`, `DATABASE_URL`, or `JWT_SECRET`.

| Configuration item | Location | Repository safe? | Purpose |
|---|---|---:|---|
| Built-in LLM credentials | Server environment only | No — never commit | Executes each real agent call. |
| Database URL | Server environment only | No — never commit | Persists runs and structured artefacts. |
| `config.js` API origin | Public GitHub Pages file | Yes | Points the public dashboard at the separately hosted protected API. It contains no credential. |
| Google Workspace feed URL | Server source constant | Yes | Public keyless live-data source, documented in `liveWorkspaceFeed.ts`. |

The managed project environment does not permit `.env` or `.env.example` files to be generated or edited. This document and `client/public/config.js` are the safe, version-controlled configuration guides. In a non-managed deployment, create local environment variables from these names without committing the values.
