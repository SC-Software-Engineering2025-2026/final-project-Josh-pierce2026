import React, { useState } from "react";
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
        <div className="badge-pill">Local only · Private</div>
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
