import React, { useState } from "react";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function ClassEditor({ initialMap = {}, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...initialMap });

  function update(letter, value) {
    const next = { ...(draft || {}) };
    if (value && value.trim().length) next[letter] = value.trim();
    else delete next[letter];
    setDraft(next);
  }

  function clearAll() {
    setDraft({});
  }

  function doSave() {
    try {
      localStorage.setItem("sierra_classes", JSON.stringify(draft));
    } catch (e) {
      // ignore
    }
    onSave && onSave(draft);
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div className="muted">Class names (A–H)</div>
      <div style={{ marginTop: 8 }}>
        {LETTERS.map((L) => (
          <div
            key={L}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div style={{ width: 28, fontWeight: 700 }}>{L}</div>
            <input
              value={(draft && draft[L]) || ""}
              onChange={(e) => update(L, e.target.value)}
              placeholder={`Class for ${L} (optional)`}
              style={{ flex: 1, padding: 6, borderRadius: 6 }}
            />
            {draft && draft[L] ? (
              <button
                className="mode-btn"
                onClick={() => update(L, "")}
                title={`Clear ${L}`}
              >
                Clear
              </button>
            ) : null}
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="mode-btn" onClick={doSave}>
            Save
          </button>
          <button
            className="mode-btn"
            onClick={() => {
              clearAll();
            }}
          >
            Clear all (draft)
          </button>
          <button
            className="mode-btn"
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
