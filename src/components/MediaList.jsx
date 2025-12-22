import React from "react";
import { RatingStars } from "./RatingStars.jsx";

export function MediaList({
  items,
  onUpdateRating,
  onUpdateNotes,
  onRemove,
  view = "list",
}) {
  if (!items.length) {
    return <div className="empty-state">Nothing logged here yet.</div>;
  }

  const formatDate = (iso) => {
    if (!iso) return "Unknown date";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown date";
    return d.toLocaleDateString();
  };

  if (view === "grid") {
    return (
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.localId} className="media-card">
            <div className="media-thumb">
              {item.coverUrl ? (
                <img src={item.coverUrl} alt={item.title} />
              ) : (
                <div className="media-thumb-initial">
                  {item.title?.slice(0, 1) || "?"}
                </div>
              )}
            </div>
            <div className="media-card-body">
              <div className="media-title">{item.title}</div>
              <div className="media-meta">
                {item.meta}
                {item.extra ? ` · ${item.extra}` : ""}
              </div>
              {onUpdateNotes && (
                <textarea
                  className="note-input"
                  rows={2}
                  placeholder="Notes…"
                  value={item.notes ?? ""}
                  onChange={(e) => onUpdateNotes(item.localId, e.target.value)}
                />
              )}
              <div className="media-footer">
                <div>
                  <RatingStars
                    value={item.rating ?? 0}
                    onChange={(val) => onUpdateRating(item.localId, val)}
                  />
                  <div className="small-caption">
                    Tap stars to rate / update
                  </div>
                </div>
                <div className="media-meta-right">
                  <div className="badge-rating">
                    <span>{item.rating ?? 0}</span>
                    <span className="badge-rating-sub">/ 5</span>
                  </div>
                  <div className="badge-date">
                    Logged {formatDate(item.createdAt)}
                  </div>
                  <button
                    type="button"
                    className="ghost-button small"
                    onClick={() => onRemove && onRemove(item.localId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="items-list">
      {items.map((item) => (
        <li key={item.localId} className="media-row">
          <div className="media-thumb">
            {item.coverUrl ? (
              <img src={item.coverUrl} alt={item.title} />
            ) : (
              <div className="media-thumb-initial">
                {item.title?.slice(0, 1) || "?"}
              </div>
            )}
          </div>
          <div className="media-main">
            <div className="media-title">{item.title}</div>
            <div className="media-meta">
              {item.meta}
              {item.extra ? ` · ${item.extra}` : ""}
            </div>
            {onUpdateNotes && (
              <textarea
                className="note-input"
                rows={2}
                placeholder="Notes…"
                value={item.notes ?? ""}
                onChange={(e) => onUpdateNotes(item.localId, e.target.value)}
              />
            )}
            <div className="media-footer">
              <div>
                <RatingStars
                  value={item.rating ?? 0}
                  onChange={(val) => onUpdateRating(item.localId, val)}
                />
                <div className="small-caption">Tap stars to rate / update</div>
              </div>
              <div className="media-meta-right">
                <div className="badge-rating">
                  <span>{item.rating ?? 0}</span>
                  <span className="badge-rating-sub">/ 5</span>
                </div>
                <div className="badge-date">
                  Logged {formatDate(item.createdAt)}
                </div>
                <button
                  type="button"
                  className="ghost-button small"
                  onClick={() => onRemove && onRemove(item.localId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
