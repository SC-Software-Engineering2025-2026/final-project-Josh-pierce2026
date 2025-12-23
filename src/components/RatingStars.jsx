import React from "react";

// 5-star rating widget with half-star support.
//
// - Displays a fixed row of MAX_STARS stars.
// - Click position inside a star (left/right) determines whether
//   the change is by 0.5 or 1.0 for that star index.
// - Calls onChange(nextRating) so parents can persist the value.
const MAX_STARS = 5;

export function RatingStars({ value, onChange }) {
  const numeric = Number(value) || 0;
  const clamped = Math.max(0, Math.min(MAX_STARS, numeric));

  const handleClick = (index, event) => {
    if (!onChange) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const isHalf = relativeX < rect.width / 2;
    const next = isHalf ? index + 0.5 : index + 1;
    onChange(next);
  };

  return (
    <div className="star-row" aria-label={`Rating: ${clamped}/5`}>
      {Array.from({ length: MAX_STARS }).map((_, i) => {
        let state = "empty";
        if (clamped >= i + 1) state = "full";
        else if (clamped >= i + 0.5) state = "half";

        const className =
          "star-icon" +
          (state === "full" ? " filled" : "") +
          (state === "half" ? " half" : "");

        return (
          <span
            key={i}
            className={className}
            onClick={(e) => handleClick(i, e)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
