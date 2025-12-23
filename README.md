# Senior Project: React Application with GitHub Copilot

## 📋 Project Information

**Student Name:** Josh Pierce
**GitHub Username:** Josh-pierce2026
**Repository URL:** [This Repository]  
**Deployed URL:** [To be added after deployment]

---

## 🎯 Project Overview

### Project Title

BetterBoxd – Personal Media Tracker

### Project Description

BetterBoxd is a personal media tracking application inspired by sites like Letterboxd and Goodreads, but intentionally designed to be fully private. It lets you keep a single, unified log of what you watch, read, play, and listen to across five categories: movies, TV shows, books, albums, and games.

Instead of relying on memory (or scattered notes), BetterBoxd gives you a structured place to search external APIs (TMDB, Google Books, Discogs, RAWG), pull in cover art and metadata, and then record your own ratings, notes, and dates. The app emphasizes your personal archive rather than social features: there are no profiles, followers, or public feeds—everything is stored locally in your browser.

The focus on privacy, multiple media types in a single interface, half‑star ratings, per‑item notes, and import/export of your data makes BetterBoxd a flexible diary for your media habits that you fully own and control.

### Motivation

I chose this project because I already enjoy tracking the movies, shows, and books I consume, but I wanted a tool that was completely under my control and not tied to a social network. Existing platforms are great discovery tools but often emphasize public activity, feeds, and algorithms over private reflection.

Building BetterBoxd let me combine several interests at once: front‑end engineering with React, working with real-world APIs, and designing a focused user experience around a specific workflow. It also connects to my long‑term goals of becoming more comfortable architecting full front‑end applications, managing state, and thinking about data ownership and portability (via local storage and JSON import/export).

---

## 🛠️ Technical Specifications

### Core Features

- [x] **Multi‑media tabs:** Separate tabs for Movies, TV Shows, Books, Albums, and Games, each with its own search and logged items.
- [x] **External API search:** Search TMDB (movies/TV), Google Books, Discogs (albums), and RAWG (games) and pull in titles, years, authors/platforms, and cover art.
- [x] **Ratings, notes, and dates:** Rate items on a 0–5 star scale (with half‑star precision), add personal notes, and track when an item was logged.
- [x] **Flexible views & UI:** Switch between list and grid views with visible cover art, collapsible descriptions for long overviews, and per‑item remove controls.
- [x] **Local persistence:** All logged items are stored in the browser’s localStorage per media type, so data persists across sessions without any backend.
- [x] **Import/export:** Export all logged data to a JSON file and re‑import it later (or on another machine) to restore your full media log.

### Technology Stack

| Category                 | Technology/Library                                                      |
| ------------------------ | ----------------------------------------------------------------------- |
| **Frontend Framework**   | React 18.x (via Vite)                                                   |
| **UI Library**           | Custom CSS (no external UI library)                                     |
| **State Management**     | React `useState` + custom `useLocalStorage` hook                        |
| **APIs/Backend**         | Public REST APIs: TMDB, Google Books, Discogs, RAWG (no custom backend) |
| **Routing**              | Single-page app with tabbed navigation (no React Router)                |
| **HTTP Client**          | Native Fetch API                                                        |
| **Additional Libraries** | Vite + `@vitejs/plugin-react-swc` for tooling                           |

### User Interface Design

The UI is a single-page React application with a top header, tabbed navigation, and per‑tab content areas. The design uses a dark, glass‑style theme with card panels for search and logged items.

**Main Views:**

1. **Home Shell / Tabs:** Header with app title (BetterBoxd), privacy badge, and global import/export controls, plus a tab bar for switching between Movies, TV, Books, Albums, and Games.
2. **Per‑media tab – Search panel:** A collapsible “Search & add” card at the top of each tab with a search box, API‑powered results list including cover art, and an Add button that opens a draft editor for rating/notes before saving.
3. **Per‑media tab – Logged items panel:** A “Your [media]” card showing all logged items for that category, with sort controls (by recent or rating), a view toggle (list/grid), cover art, ratings, notes, logged dates, collapsible descriptions (for movies/TV), and remove actions.

### Data Management

Data comes from two places: external content APIs and local browser storage. Searches are performed on external services (TMDB, Google Books, Discogs, RAWG) and normalized into a common shape (`id`, `title`, `meta`, `extra`, `coverUrl`). When the user decides to save an item, that normalized data is combined with user‑specific fields (rating, notes, `createdAt`) and stored in `localStorage`.

Each media type has its own key in `localStorage` (e.g., `media_movies`, `media_tv`, `media_books`, `media_albums`, `media_games`), managed through a reusable `useLocalStorage` hook. This keeps the app completely client‑side and private: there is no external database.

For portability, the app also supports exporting all of these arrays into a single JSON file and importing that file later to repopulate the same keys in `localStorage`.

---

## 🤖 GitHub Copilot Integration

### Planned Use Cases

- [x] Component scaffolding and layout/props patterns for tabs, lists, and reusable UI pieces
- [x] API integration and data fetching logic for TMDB, Google Books, Discogs, and RAWG helpers
- [ ] Writing unit tests
- [x] Refactoring UI flows (e.g., search dropdowns, draft‑before‑save, grid/list toggles) and polishing UX copy

---

## 📅 Project Timeline & Milestones

### Milestone 1: Project Setup ✅

**Target Date:** [Date]

**Deliverables:**

- [x] Initialize React project
- [x] Set up GitHub repository
- [x] Configure GitHub Copilot
- [x] Create basic project structure

---

### Milestone 2: Core Features 🚧

**Target Date:** [Date]

**Deliverables:**

- [x] Basic tabbed layout with Movies, TV Shows, and Books
- [x] Integration with TMDB and Google Books search APIs
- [x] Ability to log items with ratings and dates
- [x] Local storage persistence for logged items

---

### Milestone 3: UI/UX Polish 📋

**Target Date:** [Date]

**Deliverables:**

- [x] Dark theme styling with card panels, tabs, and hover states
- [x] Grid and list views with cover art and improved readability
- [x] Responsive layout that adapts to different screen widths
- [ ] Accessibility review and keyboard navigation improvements

---

### Milestone 4: Testing & Deployment 🚀

**Target Date:** [Date]

**Deliverables:**

- [ ] Write and run tests
- [x] Fix bugs and optimize core flows (search, logging, import/export)
- [ ] Deploy to hosting platform
- [ ] Prepare final presentation

---

## ✅ Success Criteria

- [x] All core features (logging, rating, notes, sorting, import/export) are functional
- [ ] Application is deployed and accessible online
- [ ] Code is well-documented with clear comments where needed
- [x] External API integrations are reliable and handle error states gracefully
- [x] User data remains private and fully under the user’s control via local storage and JSON export/import

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js (v16 or higher)
npm or yarn
Git
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/Josh-pierce2026/final-project-Josh-pierce2026.git
cd final-project-Josh-pierce2026
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
touch .env
# Edit .env with your configuration, for example:

VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_GOOGLE_BOOKS_KEY=your_google_books_key
VITE_DISCOGS_KEY=your_discogs_consumer_key
VITE_DISCOGS_SECRET=your_discogs_consumer_secret
VITE_RAWG_API_KEY=your_rawg_api_key
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser (default Vite dev port)

---

## 📁 Project Structure

```
project-root/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx          # Vite entry point, renders <App />
│   ├── index.css         # Global styles (layout, cards, grid/list)
│   ├── App.jsx           # Root shell with header, tabs, import/export
│   ├── hooks/
│   │   └── useLocalStorage.js   # Reusable localStorage state hook
│   ├── api/
│   │   ├── tmdb.js       # TMDB helpers for movies and TV
│   │   ├── googleBooks.js# Google Books search helper
│   │   ├── discogs.js    # Discogs album search helper
│   │   └── rawg.js       # RAWG games search helper
│   └── components/
│       ├── MoviesTab.jsx
│       ├── TvTab.jsx
│       ├── BooksTab.jsx
│       ├── AlbumsTab.jsx
│       ├── GamesTab.jsx
│       ├── MediaList.jsx
│       ├── SearchResults.jsx
│       ├── SortSelect.jsx
│       └── RatingStars.jsx
└── README.md
```

---

## 🧪 Testing

At this stage the project does not include automated unit tests; all testing has been done manually through the browser by exercising each tab, search flow, and import/export.

If time permits, future work could include adding tests with a framework like Vitest/React Testing Library for critical components (e.g., the `useLocalStorage` hook, `MediaList`, and the import/export handlers in `App`).

---

## 🌐 Deployment

Deployment has not been completed yet. The app is currently run locally via the Vite dev server (`npm run dev`) or production build (`npm run build` + `npm run preview`).

The project is suitable for static hosting on platforms like Netlify or Vercel (build command `npm run build`, output directory `dist`). Once deployed, the live URL can be added here.

---

## 📸 Screenshots

[Add screenshots of your application once developed]

### Home Page

![Home Page](./screenshots/home.png)

### [Feature Name]

![Feature](./screenshots/feature.png)

---

## 🎓 Reflections & Learnings

### What I Learned

[Reflect on what you learned throughout this project]

### Challenges Faced

[Discuss significant challenges and how you overcame them]

### GitHub Copilot Experience

[Discuss how GitHub Copilot helped or hindered your development process. Provide specific examples.]

### Future Improvements

[What would you do differently or add if you had more time?]

---

## 📚 Resources & References

- [React Documentation](https://react.dev)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Other resource]
- [Other resource]

---

# 📊 Grading Rubric

## Total Points: 100

### 1. Project Planning & Documentation (20 points)

| Criteria               | Excellent (5)                                      | Good (4)                                | Fair (3)                             | Poor (1-2)               |
| ---------------------- | -------------------------------------------------- | --------------------------------------- | ------------------------------------ | ------------------------ |
| **Project Proposal**   | Complete, clear, well-thought-out proposal         | Mostly complete with minor gaps         | Basic proposal with significant gaps | Incomplete or unclear    |
| **README.md**          | Professional, comprehensive, includes all sections | Good documentation with minor omissions | Basic documentation                  | Minimal or missing       |
| **Code Comments**      | Clear, helpful comments throughout                 | Good comments on complex sections       | Some comments present                | Few or no comments       |
| **Milestone Tracking** | All milestones met on time                         | Most milestones met with minor delays   | Several milestones delayed           | Poor milestone adherence |

---

### 2. Technical Implementation (35 points)

| Criteria                            | Excellent (9-10)                                  | Good (7-8)                                      | Fair (5-6)                                | Poor (1-4)            |
| ----------------------------------- | ------------------------------------------------- | ----------------------------------------------- | ----------------------------------------- | --------------------- |
| **React Components**                | Well-structured, reusable, follows best practices | Good structure with minor issues                | Basic components with some poor practices | Poorly structured     |
| **State Management**                | Effective state management throughout             | Good state management with minor inefficiencies | Basic state management                    | Poor state handling   |
| **API Integration / Data Handling** | Robust error handling, efficient data flow        | Good implementation with minor gaps             | Basic implementation                      | Incomplete or buggy   |
| **Code Quality & Organization**     | Clean, organized, follows conventions             | Mostly clean and organized                      | Some organization issues                  | Messy or disorganized |

---

### 3. Feature Completion & Functionality (25 points)

| Criteria                | Excellent (9-10)                           | Good (7-8)                            | Fair (5-6)                        | Poor (1-4)                      |
| ----------------------- | ------------------------------------------ | ------------------------------------- | --------------------------------- | ------------------------------- |
| **Core Features**       | All features fully implemented and working | Most features working with minor bugs | Some features incomplete or buggy | Many missing or broken features |
| **User Experience**     | Intuitive, smooth, professional            | Good UX with minor usability issues   | Functional but not polished       | Poor or confusing UX            |
| **Testing & Bug Fixes** | Thorough testing, minimal bugs             | Good testing, few minor bugs          | Some testing, several bugs        | Little testing, many bugs       |

---

### 4. GitHub Copilot Usage & Learning (10 points)

| Criteria                     | Excellent (5)                                                 | Good (4)                    | Fair (3)                         | Poor (1-2)                  |
| ---------------------------- | ------------------------------------------------------------- | --------------------------- | -------------------------------- | --------------------------- |
| **Effective Use of Copilot** | Strategic use, understands suggestions, improves productivity | Good use with some reliance | Basic use, limited understanding | Minimal or blind acceptance |
| **Code Understanding**       | Can explain all code, modifies suggestions appropriately      | Understands most code       | Limited understanding            | Cannot explain code         |

---

### 5. Presentation & Deployment (10 points)

| Criteria               | Excellent (5)                                    | Good (4)                            | Fair (3)                             | Poor (1-2)                     |
| ---------------------- | ------------------------------------------------ | ----------------------------------- | ------------------------------------ | ------------------------------ |
| **Final Presentation** | Clear, engaging, demonstrates deep understanding | Good presentation with minor issues | Basic presentation                   | Unclear or unprepared          |
| **Deployment**         | Successfully deployed, fully functional online   | Deployed with minor issues          | Deployed but with significant issues | Not deployed or non-functional |

---

# 🎯 Detailed Milestone Guide

## Milestone 1: Project Initiation & Planning (Week 1-2)

### Deliverables

- ✅ Completed project proposal document
- ✅ GitHub repository created with initial README
- ✅ React project initialized with basic folder structure
- ✅ GitHub Copilot configured and tested
- ✅ Wireframes or mockups of main views

### Success Criteria

- Clear project scope and feature list defined
- Development environment fully set up
- Can successfully create and commit code to GitHub

---

## Milestone 2: Core Functionality Development (Week 3-5)

### Deliverables

- 🔲 Basic component structure implemented
- 🔲 At least 2-3 core features working
- 🔲 State management implemented
- 🔲 API integration or data handling in place
- 🔲 Regular commits showing progress

### Success Criteria

- Application demonstrates core concept/purpose
- Components are reusable and well-organized
- Data flows correctly through the application

---

## Milestone 3: Feature Completion & UI Polish (Week 6-8)

### Deliverables

- 🔲 All planned features implemented
- 🔲 UI styled with chosen library or CSS framework
- 🔲 Responsive design working on mobile and desktop
- 🔲 Error handling and loading states implemented
- 🔲 Code comments and documentation added

### Success Criteria

- Application looks professional and polished
- User experience is intuitive and smooth
- No major bugs in core functionality

---

## Milestone 4: Testing, Optimization & Deployment (Week 9-10)

### Deliverables

- 🔲 Comprehensive testing completed
- 🔲 All known bugs fixed
- 🔲 Performance optimized
- 🔲 Application deployed to hosting platform (Vercel, Netlify, etc.)
- 🔲 README updated with deployment URL and instructions

### Success Criteria

- Application is live and accessible via URL
- All features work correctly in production
- Documentation is complete and accurate

---

## Milestone 5: Final Presentation (Week 11)

### Deliverables

- 🔲 Presentation slides or demo prepared
- 🔲 Live demonstration of application
- 🔲 Code walkthrough highlighting key components
- 🔲 Discussion of GitHub Copilot usage and lessons learned
- 🔲 Reflection on challenges and solutions

### Presentation Requirements (10-15 minutes)

1. Project overview and motivation
2. Live demo of key features
3. Technical highlights and interesting code
4. How GitHub Copilot helped (with specific examples)
5. Challenges faced and how you overcame them
6. What you learned and future improvements

---

# 💡 Tips for Success

## GitHub Best Practices

- ✅ Commit regularly with clear, descriptive messages
- ✅ Use branches for new features
- ✅ Write a comprehensive README with setup instructions
- ✅ Include a .gitignore file to exclude node_modules and sensitive data
- ✅ Use meaningful branch names (feature/user-auth, bugfix/login-error)

## Working with GitHub Copilot

- ✅ Always review and understand suggested code before accepting
- ✅ Use comments to guide Copilot toward desired solutions
- ✅ Test all code thoroughly, especially AI-generated suggestions
- ✅ Modify suggestions to match your project's style and needs
- ✅ Document interesting or non-obvious code sections
- ⚠️ Don't blindly accept suggestions - understand what the code does
- ⚠️ Be aware of potential security issues in generated code

## Time Management

- ⏰ Start early and work consistently
- ⏰ Build incrementally - get one feature working before moving to the next
- ⏰ Test frequently to catch issues early
- ⏰ Leave time for polish and deployment
- ⏰ Ask for help when stuck - don't wait until the last minute

## Code Quality

- 📝 Write clean, readable code
- 📝 Follow consistent naming conventions
- 📝 Keep components small and focused
- 📝 Extract reusable logic into custom hooks
- 📝 Handle errors gracefully
- 📝 Add loading states for async operations

---

# 🔗 Helpful Resources

## React

- [React Official Documentation](https://react.dev)
- [React Hooks Documentation](https://react.dev/reference/react)
- [React Router Documentation](https://reactrouter.com)

## GitHub Copilot

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Getting Started with Copilot](https://docs.github.com/copilot/getting-started-with-github-copilot)

## Deployment Platforms

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)
- [Render](https://render.com)

## UI Libraries & Styling

- [Tailwind CSS](https://tailwindcss.com)
- [Material-UI](https://mui.com)
- [Chakra UI](https://chakra-ui.com)
- [React Bootstrap](https://react-bootstrap.github.io)

## Additional Tools

- [Axios](https://axios-http.com) - HTTP client
- [React Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs) - State management
- [React Hook Form](https://react-hook-form.com) - Form handling

---

## 📞 Getting Help

If you encounter issues:

1. Check the documentation for the library/tool you're using
2. Search Stack Overflow for similar problems
3. Ask GitHub Copilot for suggestions (but verify the code!)
4. Discuss with classmates (collaboration is encouraged!)

---

**Good luck with your project! 🚀**
