import type { SourceEvidence } from "./types";

/**
 * LIVE DATA QUERY — this function intentionally fetches the official RSS feed
 * at run time. It does not read a repository fixture, persisted cache, or
 * hardcoded release-note value. The cache-busting query and no-store setting
 * make the fresh external request visible in both source review and run output.
 */
export const GOOGLE_WORKSPACE_RELEASE_FEED_URL = "https://developers.google.com/feeds/workspace-release-notes.xml";

type FeedItem = SourceEvidence["items"][number];

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(entry: string, tag: string) {
  const match = entry.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function extractHref(entry: string) {
  const match = entry.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ?? "https://developers.google.com/workspace/release-notes";
}

function parseAtomFeed(xml: string): FeedItem[] {
  const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
  return entries.slice(0, 3).map(entry => ({
    title: extractTag(entry, "title") || "Untitled Google Workspace update",
    publishedAt: extractTag(entry, "updated") || extractTag(entry, "published"),
    summary: extractTag(entry, "content") || extractTag(entry, "summary"),
    link: extractHref(entry),
  }));
}

export async function fetchLiveGoogleWorkspaceUpdates(): Promise<SourceEvidence> {
  const fetchedAt = new Date().toISOString();
  const liveUrl = `${GOOGLE_WORKSPACE_RELEASE_FEED_URL}?pipelineRun=${Date.now()}`;
  const response = await fetch(liveUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      "User-Agent": "LearningArchitectsAgenticOrganisation/1.0 (educational prototype)",
    },
  });

  if (!response.ok) {
    throw new Error(`Live Google Workspace feed request failed with HTTP ${response.status}`);
  }

  const xml = await response.text();
  const items = parseAtomFeed(xml);
  if (items.length === 0) {
    throw new Error("The live Google Workspace feed returned no parseable entries");
  }

  return {
    sourceName: "Google Workspace developer release notes (official live RSS feed)",
    sourceUrl: liveUrl,
    fetchedAt,
    httpStatus: response.status,
    items,
  };
}
