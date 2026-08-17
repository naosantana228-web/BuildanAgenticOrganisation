# GitHub Pages Deployment

The public dashboard is deployed from the included `.github/workflows/deploy-pages.yml` workflow. It runs `pnpm build:pages`, which uses a production base path of `/BuildanAgenticOrganisation/` and publishes the Vite output from `dist/public`.

Before enabling the workflow, update the public repository file `client/public/config.js` with the HTTPS origin of the separately deployed protected API. For example:

```js
window.__AGENTIC_CONFIG__ = {
  apiBaseUrl: "https://your-protected-api.example.com",
};
```

This value is an endpoint address only; it is safe to publish and must not contain a token, secret, username, or password. The protected API must host the server code in this repository with its database and built-in LLM environment configured. It permits requests from `https://naosantana228-web.github.io` while keeping all model credentials on the server.

After committing and pushing, open the repository **Settings → Pages**, select **GitHub Actions** as the source, then open the **Actions** tab and use **Run workflow** for “Deploy public marker dashboard to GitHub Pages.” This deliberately requires the repository owner’s explicit deployment action. The expected public dashboard address is:

```text
https://naosantana228-web.github.io/BuildanAgenticOrganisation/
```

Run a final external-browser test after configuring the API endpoint. The user interface will display a clear request failure rather than replacing a failed live query with a stored value.
