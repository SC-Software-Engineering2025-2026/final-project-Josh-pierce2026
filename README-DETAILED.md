# BetterBoxd – Detailed Project Documentation

This document complements the main README.md by describing the BetterBoxd project in more depth: architecture, data model, component responsibilities, API integration details, and key UX flows.

---

## 1. High-Level Overview

BetterBoxd is a private, single-page React application for tracking personal media consumption across five categories:

- Movies
- TV Shows
- Books
- Music Albums
- Video Games

The app is intentionally **local-only**:

- No user accounts or backend database
- All logged items are persisted in `window.localStorage`
- Data can be exported to / imported from a JSON file

External content (titles, covers, metadata) is fetched from public APIs:

- **TMDB** – Movies and TV shows
- **Google Books** – Books
- **Discogs** – Albums
- **RAWG** – Games

The core loop per media type is:

1. Search an external API.
2. Choose a result and optionally set a rating and notes in a draft editor.
3. Save it to the local log with a timestamp.
4. View / sort / rate / annotate / remove logged items.

---

## 2. Architecture & Project Structure

Key files and directories:

- `index.html` – Vite entry HTML.
- `vite.config.js` – Vite + React SWC configuration.
- `src/main.jsx` – Renders `<App />` into `#root`.
- `src/index.css` – Global styles for layout, tabs, cards, list/grid, etc.
- `src/App.jsx` – Root shell: header, tabs, and global import/export logic.

Subdirectories:

- `src/hooks/`
  - `useLocalStorage.js` – Custom hook used by all tabs to mirror state into `localStorage`.
- `src/api/`
  - `tmdb.js` – TMDB helpers: `searchMovies`, `searchTvShows`.
  - `googleBooks.js` – Google Books helper: `searchBooks`.
  - `discogs.js` – Discogs helper: `searchAlbums`.
  - `rawg.js` – RAWG helper: `searchGames`.
- `src/components/`
  - `MoviesTab.jsx`, `TvTab.jsx`, `BooksTab.jsx`, `AlbumsTab.jsx`, `GamesTab.jsx`
  - `MediaList.jsx` – Shared renderer for logged items (list + grid).
  - `SearchResults.jsx` – Shared renderer for API search results.
  - `SortSelect.jsx` – Sort dropdown.
  - `RatingStars.jsx` – 5-star, half-star rating widget.

The app uses **tab-based navigation** implemented in `App.jsx` (no React Router). Each tab is responsible for:

- Search query state and API calls
- Draft editor state for adding a new item
- Logged items state via `useLocalStorage`
- Sorting, view toggling (list/grid), and removal

---

## 3. Data Model & Local Storage

BetterBoxd uses a consistent data shape for logged items across all media types.

### 3.1 Normalized item shape

Each logged item has:

```ts
interface LoggedItem {
  localId: string; // unique per log, composed from API id + timestamp
  apiId: string; // original id from the external API
  title: string; // primary title/name
  meta: string; // short detail (e.g., year, authors, platforms)
  extra: string; // longer detail (e.g., overview or published date)
  coverUrl: string | null; // URL to cover/poster/artwork
  rating: number; // 0–5, includes half steps like 3.5
  notes: string; // freeform notes from the user
  createdAt: string; // ISO timestamp when the item was logged
}
```

Each API helper produces **search results** in a similar, but slightly simpler, shape:

```ts
interface SearchResult {
  id: string; // API-specific id
  title: string;
  meta: string;
  extra: string;
  coverUrl: string | null;
}
```

Tabs convert a `SearchResult` into a `LoggedItem` when saving.

### 3.2 Local storage keys

Each media type stores its items under a distinct key:

- Movies: `media_movies`
- TV Shows: `media_tv`
- Books: `media_books`
- Albums: `media_albums`
- Games: `media_games`

`useLocalStorage(key, initialValue)` abstracts the boilerplate:

- On first load, it tries to `JSON.parse(localStorage.getItem(key))`.
- On every state change, it writes back `JSON.stringify(value)`.

This makes each tab’s `items` array fully persistent in the browser.

### 3.3 Import/export format

The **Export data** button in `App.jsx` produces a JSON file with the following structure:

```json
{
  "version": 1,
  "exportedAt": "2025-12-22T12:34:56.789Z",
  "movies": [
    /* array of LoggedItem */
  ],
  "tv": [
    /* array of LoggedItem */
  ],
  "books": [
    /* array of LoggedItem */
  ],
  "albums": [
    /* array of LoggedItem */
  ],
  "games": [
    /* array of LoggedItem */
  ]
}
```

On **Import data**:

- The user selects a JSON file.
- The file is parsed and each array is written back to the corresponding `localStorage` key.
- The page reloads so each tab re-reads the new data.

If the file does not follow this structure, the app shows an alert and does not modify storage.

---

## 4. Key Components & Behaviors

### 4.1 App.jsx

Responsibilities:

- Holds current tab state (`movies`, `tv`, `books`, `albums`, `games`).
- Renders the top header (title, privacy badge, import/export controls).
- Renders the tab buttons and switches between tab components.
- Implements `handleExport` and `handleImportFileChange` to bridge between `localStorage` and the JSON file format.

### 4.2 Tab components

Each tab (Movies, TV, Books, Albums, Games) follows the same pattern:

State:

- `query`: current search text
- `results`: current search results from the API
- `loading` / `error`: request status
- `sortBy`: `"recent" | "ratingDesc" | "ratingAsc"`
- `view`: `"list" | "grid"`
- `showSearch`: boolean, whether the search card is expanded
- `items`: logged items, persisted with `useLocalStorage`
- `draft`: temporary state when adding a new item (currently used for Movies/TV)

Handlers:

- `handleSearch`: debounce-free search function that calls the appropriate API helper and populates `results`.
- `handleStartAdd`: when the user clicks **Add** on a search result, this populates `draft` with the chosen result plus default `rating` and `notes`.
- `handleSaveDraft` / `handleCancelDraft` (Movies/TV): convert the draft into a `LoggedItem` and push into `items`, or discard it.
- `handleUpdateRating`, `handleUpdateNotes`, `handleRemove`: passed down to `MediaList` to update or remove items.

Rendering:

- A toolbar row with `SortSelect` and a **Search & add** toggle.
- Conditional search card that includes:
  - Search input and button
  - `SearchResults` list
  - (Movies/TV) the draft editor (rating + notes + Save/Cancel)
- Logged items card with:
  - Count of logged items
  - List/grid toggle
  - `MediaList` for the current `sortedItems`.

### 4.3 MediaList.jsx

`MediaList` is a shared renderer for logged items in both list and grid views.

Props:

- `items: LoggedItem[]`
- `onUpdateRating(localId, rating)`
- `onUpdateNotes(localId, notes)`
- `onRemove(localId)`
- `view: "list" | "grid"`

Behavior:

- If `items` is empty, shows a friendly “Nothing logged here yet.” message.
- Computes a human-readable logged date from `createdAt`.
- For long `extra` fields (especially TMDB overviews), shows a truncated description with a _Show more / Show less_ toggle per item.
- In **list view**:
  - Renders rows with a small thumbnail, title, meta, description (if any), notes textarea, rating stars, rating badge, logged date, and Remove button.
- In **grid view**:
  - Renders cards with a larger cover, title, meta, description, notes, rating stars, rating badge, logged date, and Remove button.

### 4.4 RatingStars.jsx

`RatingStars` renders a row of 5 clickable stars with half-star support.

- `MAX_STARS = 5`.
- It derives a clamped numeric rating and visually determines whether each star should be full, half, or empty.
- Click behavior:
  - Computes the click position within the star (left half vs. right half).
  - Left half → `index + 0.5`, right half → `index + 1`.
  - Calls `onChange(next)` so parent components can store the value.

This component is used both in `MediaList` for existing items and in draft editors while adding Movies/TV.

### 4.5 SearchResults.jsx

`SearchResults` displays normalized search results from any of the API helpers.

- Shows cover art (or a placeholder initial), title, and meta/extra inline.
- Provides an **Add** button per result, calling `onAdd(result)`.
- The parent tab decides whether `onAdd` immediately logs the item or starts a draft.

---

## 5. External API Integration

All API helpers live under `src/api/` and share these characteristics:

- They accept a plain string `query` and return an array of normalized `SearchResult` objects.
- They are responsible for reading the relevant `.env` key(s) and constructing the appropriate URL.
- They perform minimal error handling (throw on non‑OK responses, or log a warning if keys are missing).

### 5.1 TMDB (Movies & TV)

File: `src/api/tmdb.js`

Environment:

- `VITE_TMDB_API_KEY`

Functions:

- `searchMovies(query)` – Uses `/search/movie` to fetch movies. Normalizes:
  - `title`: title or original_title
  - `meta`: release year or `"Year unknown"`
  - `extra`: overview
  - `coverUrl`: poster image based on `TMDB_IMG_BASE`.
- `searchTvShows(query)` – Uses `/search/tv` similarly for TV shows.

### 5.2 Google Books (Books)

File: `src/api/googleBooks.js`

Environment:

- `VITE_GOOGLE_BOOKS_KEY` (optional; Google Books allows some unauthenticated requests)

Function:

- `searchBooks(query)` – Calls `/volumes` with `q=query` (and `key` if present). Normalizes:
  - `title`: volume title
  - `meta`: comma-separated authors or `"Unknown author"`
  - `extra`: publishedDate
  - `coverUrl`: thumbnail/smallThumbnail if present.

### 5.3 Discogs (Albums)

File: `src/api/discogs.js`

Environment:

- Either `VITE_DISCOGS_TOKEN` (personal token)
- Or `VITE_DISCOGS_KEY` and `VITE_DISCOGS_SECRET` (consumer key/secret)

Function:

- `searchAlbums(query)` – Calls `/database/search` with `type=release`.
  - If a token is present, uses `?token=...`.
  - Otherwise uses `?key=...&secret=...`.
  - Normalizes:
    - `title`: release title
    - `meta`: year or `"Year unknown"`
    - `extra`: country
    - `coverUrl`: `cover_image`.

### 5.4 RAWG (Games)

File: `src/api/rawg.js`

Environment:

- `VITE_RAWG_API_KEY`

Function:

- `searchGames(query)` – Calls `/games` with `search=query` and `page_size=20`.
  - Normalizes:
    - `title`: game name
    - `meta`: up to 3 platforms joined with commas
    - `extra`: release year or `"Year unknown"`
    - `coverUrl`: `background_image`.

---

## 6. Styling & Layout

All styles are defined in `src/index.css` using plain CSS.

Highlights:

- **App shell:** full-window dark background with a glass-like card for content.
- **Tabs:** pill-style tab bar with an accent underline for the active tab.
- **Cards:** two main card types – search cards and secondary “Your items” cards.
- **List vs. grid:**
  - List: compact rows with small thumbnails.
  - Grid: larger cards with prominent cover art and more breathing room.
- **Badges:** pill badges for ratings and logged dates.
- **Buttons:** ghost (outlined) buttons for secondary actions, primary gradient buttons for main actions (search, save).

---

## 7. Known Limitations & Future Improvements

- No backend or authentication – the app is strictly local; syncing across devices would require a new backend or browser sync mechanism.
- No automated tests – all testing is manual; adding unit tests and a small E2E suite would improve reliability.
- Import format is versioned but currently only supports `version: 1`; future schema changes would need migration logic.
- The draft-before-save flow is currently implemented for Movies and TV; extending it consistently to Books, Albums, and Games would align UX across all tabs.

---

## 8. How to Contribute (for future development)

- Fork the repository and create a feature branch.
- Run `npm install` and `npm run dev` to work locally.
- Keep changes focused and consistent with existing patterns (tab structure, normalized item shape, styling).
- Update both `README.md` and `README-DETAILED.md` if you add significant features or architectural changes.
