import React, { useRef, useState } from "react";
import { MoviesTab } from "./components/MoviesTab.jsx";
import { TvTab } from "./components/TvTab.jsx";
import { BooksTab } from "./components/BooksTab.jsx";
import { AlbumsTab } from "./components/AlbumsTab.jsx";
import { GamesTab } from "./components/GamesTab.jsx";

const TABS = [
  { id: "movies", label: "Movies" },
  { id: "tv", label: "TV Shows" },
  { id: "books", label: "Books" },
  { id: "albums", label: "Albums" },
  { id: "games", label: "Games" },
];

export default function App() {
  const [active, setActive] = useState("movies");
  const fileInputRef = useRef(null);

  const handleExport = () => {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    try {
      const getArray = (key) => {
        try {
          const raw = window.localStorage.getItem(key);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      };

      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        movies: getArray("media_movies"),
        tv: getArray("media_tv"),
        books: getArray("media_books"),
        albums: getArray("media_albums"),
        games: getArray("media_games"),
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "betterboxd-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
      // eslint-disable-next-line no-alert
      alert("Export failed. See console for details.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result || "");
        const data = JSON.parse(text);

        const applyArray = (prop, key) => {
          if (Array.isArray(data[prop])) {
            try {
              window.localStorage.setItem(key, JSON.stringify(data[prop]));
            } catch {
              // ignore
            }
          }
        };

        applyArray("movies", "media_movies");
        applyArray("tv", "media_tv");
        applyArray("books", "media_books");
        applyArray("albums", "media_albums");
        applyArray("games", "media_games");

        // eslint-disable-next-line no-alert
        alert("Import complete. Reloading to show changes.");
        window.location.reload();
      } catch (err) {
        console.error("Import failed", err);
        // eslint-disable-next-line no-alert
        alert("Import failed. Make sure you selected a valid export file.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const renderTab = () => {
    switch (active) {
      case "movies":
        return <MoviesTab />;
      case "tv":
        return <TvTab />;
      case "books":
        return <BooksTab />;
      case "albums":
        return <AlbumsTab />;
      case "games":
        return <GamesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="app-title">BetterBoxd</div>
          <div className="app-subtitle">
            Movies · TV · Books · Albums · Games — for your eyes only
          </div>
        </div>
        <div className="header-actions">
          <div className="badge-pill">Local only · Private</div>
          <div className="header-buttons">
            <button
              type="button"
              className="header-small-button"
              onClick={handleExport}
            >
              Export data
            </button>
            <button
              type="button"
              className="header-small-button"
              onClick={handleImportClick}
            >
              Import data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={handleImportFileChange}
            />
          </div>
        </div>
      </header>
      <nav className="app-tabs" aria-label="Media type tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={"tab-button" + (active === tab.id ? " active" : "")}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {renderTab()}
    </div>
  );
}
