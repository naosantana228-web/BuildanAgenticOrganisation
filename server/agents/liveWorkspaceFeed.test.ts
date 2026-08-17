import { afterEach, describe, expect, it, vi } from "vitest";
import { GOOGLE_WORKSPACE_RELEASE_FEED_URL, fetchLiveGoogleWorkspaceUpdates } from "./liveWorkspaceFeed";

const LIVE_FEED_SAMPLE = `<?xml version="1.0"?><feed>
  <entry><title>Sample Workspace update</title><updated>2026-08-17T10:00:00Z</updated><content><![CDATA[<p>A current product change.</p>]]></content><link href="https://developers.google.com/workspace/sample" /></entry>
  <entry><title>Second update</title><updated>2026-08-16T10:00:00Z</updated><summary>Second current signal.</summary><link href="https://developers.google.com/workspace/second" /></entry>
</feed>`;

afterEach(() => vi.restoreAllMocks());

describe("fetchLiveGoogleWorkspaceUpdates", () => {
  it("performs a fresh no-store request and records returned source evidence", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(LIVE_FEED_SAMPLE, { status: 200 }));

    const evidence = await fetchLiveGoogleWorkspaceUpdates();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestedUrl, options] = fetchMock.mock.calls[0];
    expect(String(requestedUrl)).toContain(GOOGLE_WORKSPACE_RELEASE_FEED_URL);
    expect(String(requestedUrl)).toContain("pipelineRun=");
    expect(options).toMatchObject({ cache: "no-store" });
    expect(evidence.httpStatus).toBe(200);
    expect(evidence.items).toHaveLength(2);
    expect(evidence.items[0]).toMatchObject({
      title: "Sample Workspace update",
      link: "https://developers.google.com/workspace/sample",
    });
  });

  it("fails transparently instead of substituting a static value when the live request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Unavailable", { status: 503 }));

    await expect(fetchLiveGoogleWorkspaceUpdates()).rejects.toThrow("HTTP 503");
  });
});
