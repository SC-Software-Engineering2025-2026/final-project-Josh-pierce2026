import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { searchAlbums } from "../api/discogs.js";
import { SortSelect } from "./SortSelect.jsx";
import { SearchResults } from "./SearchResults.jsx";
import { MediaList } from "./MediaList.jsx";

export function AlbumsTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [view, setView] = useState("grid");
  const [showSearch, setShowSearch] = useState(true);
  const [items, setItems] = useLocalStorage("media_albums", []);

  const handleSearch = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await searchAlbums(query);
      setResults(data);
    } catch (e) {
      console.error(e);
      setError("Problem talking to Discogs. Check your token or key/secret.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (result) => {
    const exists = items.some((i) => i.apiId === result.id);
    if (exists) return;
    const now = new Date().toISOString();
    const newItem = {
      localId: `${result.id}-${now}`,
      apiId: result.id,
      title: result.title,
      meta: result.meta,
      extra: result.extra,
      coverUrl: result.coverUrl || null,
      rating: 0,
      notes: "",
      createdAt: now,
    };
    setItems([newItem, ...items]);
  };

  const handleUpdateRating = (localId, rating) => {
    setItems(items.map((i) => (i.localId === localId ? { ...i, rating } : i)));
  };

  const handleUpdateNotes = (localId, notes) => {
    setItems(items.map((i) => (i.localId === localId ? { ...i, notes } : i)));
  };

  const handleRemove = (localId) => {
    setItems(items.filter((i) => i.localId !== localId));
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "ratingDesc") return (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === "ratingAsc") return (a.rating ?? 0) - (b.rating ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="app-content">
      <div className="toolbar-row">
        <SortSelect value={sortBy} onChange={setSortBy} />
        <button
          type="button"
          className="ghost-button"
          onClick={() => setShowSearch((v) => !v)}
        >
          {showSearch ? "Hide search" : "Search & add"}
        </button>
      </div>
      {error && <div className="empty-state">{error}</div>}
      {showSearch && (
        <section className="card-panel">
          <div className="card-header">
            <div>
              <div className="card-title">Search & add</div>
              <div className="small-caption">Powered by Discogs</div>
            </div>
          </div>
          <div className="toolbar-row" style={{ marginBottom: 6 }}>
            <input
              className="search-input"
              placeholder="Search albums on Discogs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="primary-button"
              onClick={handleSearch}
              disabled={!query.trim() || loading}
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
          <SearchResults
            results={results}
            onAdd={handleAdd}
            disabled={loading}
          />
        </section>
      )}
      <section className="card-panel secondary">
        <div className="card-header">
          <div>
            <div className="card-title">Your albums</div>
            <div className="small-caption">Stored locally in this browser</div>
          </div>
          <div className="card-right">
            <div className="card-count">{items.length} logged</div>
            <div className="view-toggle">
              <button
                type="button"
                className={
                  "view-toggle-btn" + (view === "list" ? " active" : "")
                }
                onClick={() => setView("list")}
              >
                List
              </button>
              <button
                type="button"
                className={
                  "view-toggle-btn" + (view === "grid" ? " active" : "")
                }
                onClick={() => setView("grid")}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
        <MediaList
          items={sortedItems}
          onUpdateRating={handleUpdateRating}
          onUpdateNotes={handleUpdateNotes}
          onRemove={handleRemove}
          view={view}
        />
      </section>
    </div>
  );
}
