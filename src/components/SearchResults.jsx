import React from "react";

export function SearchResults({ results, onAdd, disabled }) {
  if (!results.length) {
    return (
      <div className="empty-state">Search to pull results from the API.</div>
    );
  }

  return (
    <ul className="results-list">
      {results.map((r) => (
        <li key={r.id} className="media-row">
          <div className="media-thumb">
            {r.coverUrl ? (
              <img src={r.coverUrl} alt={r.title} />
            ) : (
              <div className="media-thumb-initial">
                {r.title?.slice(0, 1) || "?"}
              </div>
            )}
          </div>
          <div className="media-main">
            <div className="media-title">{r.title}</div>
            <div className="media-meta">
              {r.meta}
              {r.extra ? ` · ${r.extra}` : ""}
            </div>
          </div>
          <div className="media-actions">
            <button
              className="add-button"
              onClick={() => onAdd(r)}
              disabled={disabled}
            >
              +
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
