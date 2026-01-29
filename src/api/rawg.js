// RAWG search helper used by the Games tab.
// Normalizes RAWG game results into the common media item shape.
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const RAWG_BASE = "https://api.rawg.io/api";

/**
 * Search RAWG for games by title.
 * Returns objects: { id, title, meta (platforms), extra (year), coverUrl }.
 */
export async function searchGames(query) {
  if (!query?.trim()) return [];
  if (!RAWG_API_KEY) {
    throw new Error("RAWG API key (VITE_RAWG_API_KEY) is not set.");
  }

  const params = new URLSearchParams({
    key: RAWG_API_KEY,
    search: query,
    page_size: "20",
  });

  const url = `${RAWG_BASE}/games?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("RAWG request failed");
  const data = await res.json();
  const results = data.results || [];

  return results.map((g) => {
    const year = g.released
      ? new Date(g.released).getFullYear().toString()
      : "Year unknown";
    const platforms = (g.platforms || [])
      .map((p) => p.platform && p.platform.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");

    return {
      id: String(g.id),
      title: g.name || "Untitled",
      meta: platforms || "Platforms unknown",
      extra: year,
      coverUrl: g.background_image || null,
    };
  });
}
