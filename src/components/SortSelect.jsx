import React from "react";

export function SortSelect({ value, onChange }) {
  return (
    <label className="chip-select">
      Sort
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="recent">Most recent</option>
        <option value="ratingDesc">Rating: high → low</option>
        <option value="ratingAsc">Rating: low → high</option>
      </select>
    </label>
  );
}
