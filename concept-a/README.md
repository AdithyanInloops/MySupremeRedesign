# MySupreme redesign — Concept A "Pro Counter"

Clickable front-end prototype for client review. Dummy data only, no backend.
Built with React 18 + MUI v5 + Poppins so it maps 1:1 onto the Next.js / GraphCommerce rebuild.

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # static site in dist/ (hash routing; host on any static host or open via `npm run preview`)

Start the review at `#/review/summary` (concept summary), `#/review/components` (component library)
and `#/review/preview` (390 px + 1440 px side by side). The black bar at the top toggles
Signed in / Loading / Empty states on any page and has a "Jump to page" menu.
Purple dashed "New feature" tags mark anything that needs new backend data.
