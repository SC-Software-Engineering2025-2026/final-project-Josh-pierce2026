// Discogs album search helper.
// Supports either a personal token or OAuth-style key/secret credentials.
const DISCOGS_TOKEN = import.meta.env.VITE_DISCOGS_TOKEN;
const DISCOGS_KEY = import.meta.env.VITE_DISCOGS_KEY;
const DISCOGS_SECRET = import.meta.env.VITE_DISCOGS_SECRET;
const DISCOGS_BASE = "https://api.discogs.com";

/**
 * Search Discogs for album releases.
 * Uses either ?token=... or ?key=...&secret=... based on available env vars.
 * Returns objects: { id, title, meta (year), extra (country), coverUrl }.
 */
export async function searchAlbums(query) {
  if (!query?.trim()) return [];
  if (!DISCOGS_TOKEN && (!DISCOGS_KEY || !DISCOGS_SECRET)) {
    throw new Error(
      "Discogs auth is not configured. Set VITE_DISCOGS_TOKEN or VITE_DISCOGS_KEY and VITE_DISCOGS_SECRET."
    );
  }

  const params = new URLSearchParams({
    q: query,
    type: "release",
  });

  if (DISCOGS_TOKEN) {
    params.set("token", DISCOGS_TOKEN);
  } else {
    params.set("key", DISCOGS_KEY);
    params.set("secret", DISCOGS_SECRET);
  }

  const url = `${DISCOGS_BASE}/database/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "PersonalMediaTracker/1.0 +https://example.com",
    },
  });
  if (!res.ok) throw new Error("Discogs request failed");
  const data = await res.json();
  const results = data.results || [];

  return results.map((r) => ({
    id: String(r.id),
    title: r.title || "Untitled",
    meta: r.year ? String(r.year) : "Year unknown",
    extra: r.country || "",
    coverUrl: r.cover_image || null,
  }));
}
