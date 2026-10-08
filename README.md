# MySupreme redesign — concepts

Independent front-end prototypes (dummy data only) for client review. Each folder is its own app with
its own `package.json`, so each deploys as a **separate Vercel project** from this one repo.

| Folder | Concept | Stack | Vercel framework preset | Output |
| --- | --- | --- | --- | --- |
| `concept-a/` | A — "Pro Counter" full redesign | Vite + React 18 + MUI 5 | Vite | `dist` (static) |
| `concept-b/` | B — redesigned live site (full UI/UX transformation, clickable checkout) | Next.js 15 (pages router) + MUI 5 | Next.js | managed by Next |
| `concept-c/` | C — mobile app design, based on the approved Concept A | Vite + React 18 + MUI 5 | Vite | `dist` (static) |

Each folder contains a `vercel.json` (framework, install and build commands) and pins a Node version in
`package.json` → `engines`, so Vercel needs only the Root Directory.

## Deploy on Vercel (once per concept)

1. Push this repo to GitHub.
2. Vercel → **Add New… → Project** → import this repository.
3. **Root Directory** → *Edit* → choose `concept-a`, `concept-b` or `concept-c` (one Vercel project each).
4. Leave Framework, Build and Output settings as detected (they come from that folder's `vercel.json`).
   No environment variables are needed.
5. **Deploy.** Name the projects e.g. `mysupreme-concept-a`, `mysupreme-concept-b`, `mysupreme-concept-c`.

Optional: in each project → Settings → Git → **Ignored Build Step**, use
`git diff --quiet HEAD^ HEAD -- .` so a push that only touches the other concept doesn't rebuild this one.

## Run locally

    cd concept-a && npm ci && npm run dev     # http://localhost:5173
    cd concept-b && npm ci && npm run dev     # http://localhost:5180
    cd concept-c && npm ci && npm run dev     # http://localhost:5190  (mobile app; phone-width column on a laptop)

Concept A uses hash routing (`/#/cart`), so it needs no rewrites. Concept B pre-renders every page at build time
from `concept-b/data/*.json`; it makes no API calls at runtime (product images load from m2.mysupreme.ca).
