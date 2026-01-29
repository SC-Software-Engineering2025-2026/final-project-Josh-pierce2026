// TMDB search helpers for movies and TV shows.
// These functions normalize results into a common shape used by the UI.
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w342";

/**
 * Low-level helper for TMDB search endpoints.
 * Adds the API key and common params, then returns the `results` array.
 */
async function tmdbFetch(path, params = {}) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key (VITE_TMDB_API_KEY) is not set.");
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    include_adult: "false",
    ...params,
  });

  const url = `${TMDB_BASE}${path}?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB request failed");
  const data = await res.json();
  return data.results || [];
}

/**
 * Search TMDB for movies by title.
 * Returns simplified objects: { id, title, meta (year), extra (overview), coverUrl }.
 */
export async function searchMovies(query) {
  if (!query?.trim()) return [];
  const results = await tmdbFetch("/search/movie", { query });
  return results.map((m) => ({
    id: String(m.id),
    title: m.title || m.original_title,
    meta: m.release_date
      ? new Date(m.release_date).getFullYear().toString()
      : "Year unknown",
    extra: m.overview || "",
    coverUrl: m.poster_path ? `${TMDB_IMG_BASE}${m.poster_path}` : null,
  }));
}

/**
 * Search TMDB for TV shows by name.
 * Returns simplified objects: { id, title, meta (year), extra (overview), coverUrl }.
 */
export async function searchTvShows(query) {
  if (!query?.trim()) return [];
  const results = await tmdbFetch("/search/tv", { query });
  return results.map((s) => ({
    id: String(s.id),
    title: s.name || s.original_name,
    meta: s.first_air_date
      ? new Date(s.first_air_date).getFullYear().toString()
      : "Year unknown",
    extra: s.overview || "",
    coverUrl: s.poster_path ? `${TMDB_IMG_BASE}${s.poster_path}` : null,
  }));
}
