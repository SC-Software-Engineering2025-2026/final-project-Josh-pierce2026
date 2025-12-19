# Sierra Schedule — App README

This file documents the Sierra Schedule timer application specifically (the purpose-built app). It complements the project-level `README.md` and focuses on how the schedule is modeled, how to run and develop the app, and the important implementation details.

## Overview

The app is a lightweight React 18 + Vite single-page app that:

- Models an 8-day rotation schedule and computes exact Date-based start/end times for each period.
- Exposes a schedule-aware countdown UI that can either sync to the device clock or operate independently as a manual sequence.
- Provides special Monday and Wednesday schedule variants per spec.
- Contains a manual timer for arbitrary countdowns.
- Displays a persistent clock at the bottom of the main view.

## Features (detailed)

- 8-day rotation: Days 1–8 map to block labels (A–H). The rotation mapping is defined in `src/utils/schedule.js`.
- Schedule construction: `buildDaySchedule(day, mode)` returns an ordered array of period objects: `{ type, name, start: Date, end: Date }`.
- Modes:
  - `standard` — default schedule (50-minute blocks, 25-minute lab after 2nd block, 45-minute lunch after 4th block, 5-minute passing where applicable).
  - `monday` — lab replaced by a 30-minute Morning Meeting; last block shortened by 5 minutes so the day ends on the same time; no additional post-meeting delay.
  - `wednesday` — blocks and Morning Meeting are 45 minutes; passing remains.
- Sync toggle: when enabled the app computes the active period from the device clock and displays a live countdown for the active period. When disabled the schedule behaves as a manual sequencer: clicking a block starts a countdown for that block.
- Safety: the sync toggle is disabled when the device time is outside the computed school hours for the selected day and mode (this prevents accidentally syncing to a non-school window).

## File map (important files)

- `src/utils/schedule.js` — schedule building logic and time helpers. The authoritative place for rotation mapping and per-mode durations.
- `src/components/ScheduleTimer.jsx` — shows the day schedule, highlights active period, handles countdowns and transitions; supports both sync and manual modes.
- `src/components/ManualTimer.jsx` — small utility to run an arbitrary countdown (accepts `MM:SS` or `HH:MM:SS`).
- `src/components/ClockView.jsx` — persistent clock component.
- `src/App.jsx` — top-level view that ties the pieces together: sidebar controls (mode, day, scheduleMode, sync toggle), main view, and the clock.

## How scheduling is implemented

- The schedule builder starts from a fixed local-time start: 8:30 AM for the day. It iterates through the 6 blocks defined by the day's rotation and inserts lab and lunch at the specified positions.
- Each period is a JavaScript `Date` range with concrete start and end values (not relative offsets). This makes it simple in the UI to compute "time remaining" as `Math.ceil((period.end - now)/1000)`.
- Passing periods are inserted between blocks except where lab/lunch replaces or is adjacent using the implementation logic in `src/utils/schedule.js`.

## Design decisions and assumptions

- Start time: 8:30 AM local time is used as the canonical start for every constructed day.
- Durations: standard block = 50 min, lab = 25 min (except Monday/Wed overrides), passing = 5 min, lunch = 45 min.
- Monday specifics: Morning Meeting uses a 30 min duration; we do not insert a separate 5-minute delay — the meeting simply occupies the lab slot and the final block is shortened so the end time remains constant.
- Wednesday specifics: blocks and lab are shorter (45 minutes), and passing remains 5 minutes.
- Time math uses the JS Date object. Edge cases around DST transitions are not specially handled.

## Run & develop

From the project root:

```bash
npm install
npm run dev
```

- The dev server will print the local URL (usually `http://localhost:5173` or `5174` if 5173 is in use).
- Use your browser to inspect the app. The sidebar controls let you change day, schedule variant, and sync behavior.

Build for production:

```bash
npm run build
npm run preview
```

## Known issues & troubleshooting

- If you see esbuild transform errors referencing duplicated imports or symbols, open `src/components/ScheduleTimer.jsx` and `src/App.jsx` and verify they contain valid, single import blocks and syntactically-correct JSX (matching tags and no stray text outside JSX).
- If the sidebar looks cramped on narrow viewports: the buttons are set to wrap. If you still see cut-off buttons, reduce the sidebar `width` in `src/index.css` or allow the page to be narrower.

## Suggested next steps / enhancements

- Add unit tests for `buildDaySchedule` to validate Monday/Wed behavior and day boundary handling.
- Add in-app non-blocking notifications and optional sound alerts for period transitions.
- Persist UI choices (`selectedDay`, `scheduleMode`, `syncToClock`) to `localStorage`.
- Make schedule start time and durations configurable from a JSON file or UI.
- Add accessibility improvements (aria-labels and keyboard navigation).

---

If you want, I can:

- Copy this content into the main `README.md` replacing the project template, or
- Add tests for `src/utils/schedule.js`, or
- Wire a small audio alert and non-blocking toast when period ends.

Tell me which option you'd like next and I'll add it to the todo list and implement it.
