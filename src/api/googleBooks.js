// Google Books search helper used by the Books tab.
// Normalizes Google volume results into the common media item shape.
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
const GOOGLE_BASE = "https://www.googleapis.com/books/v1";

/**
 * Search Google Books for volumes that match the query string.
 * Returns objects: { id, title, meta (authors), extra (publishedDate), coverUrl }.
 */
export async function searchBooks(query) {
  if (!query?.trim()) return [];

  const params = new URLSearchParams({ q: query });
  if (GOOGLE_API_KEY) params.set("key", GOOGLE_API_KEY);

  const url = `${GOOGLE_BASE}/volumes?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Google Books request failed");
  const data = await res.json();
  const items = data.items || [];

  return items.map((b) => {
    const info = b.volumeInfo || {};
    const images = info.imageLinks || {};
    return {
      id: b.id,
      title: info.title || "Untitled",
      meta: (info.authors && info.authors.join(", ")) || "Unknown author",
      extra: info.publishedDate || "",
      coverUrl: images.thumbnail || images.smallThumbnail || null,
    };
  });
}
