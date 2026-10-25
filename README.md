# Kolab · Creator frontend (Vite + React)

The influencer side of Kolab, built from your Figma file "creaters" (Creator App page).
Every screen in the file is here: Home, Find jobs, Job details + bid, My bids, Active job, Earnings, Profile,
Messages, Agreement, plus the overlays (bid sent, draft sent, agreement accepted/declined, withdraw, notifications, edit profile)
and the toasts. It is responsive: sidebar on desktop, top bar + bottom tabs on phones and tablets.

It runs on **sample data out of the box**. When your backend is ready you only change `.env` and, if your paths differ, `src/config/endpoints.js`.

---

## 1. Requirements

* **Node.js 18 or newer** (20 LTS recommended): https://nodejs.org
* npm (comes with Node). yarn or pnpm also work.
* A modern browser. The app uses local system fonts and does not need internet access.

## 2. Start it

```bash
# 1. open a terminal in this folder
npm install --offline  # uses the local npm cache; no network requests
npm run dev            # opens http://localhost:5173
```

The included `.env` uses built-in sample data, so no backend is needed. Offline installation
works when the required packages are already present in npm's local cache. If they are not,
install dependencies once while online before using this project without a network.

Other commands:

```bash
npm run build          # production build into /dist
npm run preview        # serve the production build locally (port 4173)
```

## 3. Connect your backend

Open `.env`:

```
VITE_USE_MOCK=false                        # switch from sample data to your API
VITE_API_BASE_URL=https://api.yourapp.com  # no trailing slash
```

Restart `npm run dev` after editing `.env`.

* **All URLs live in one file:** `src/config/endpoints.js`. Change a path there and the whole app follows.
* **All data calls live in one file:** `src/services/api.js`. Pages never call `fetch` directly.
* **HTTP client:** `src/services/http.js` sends JSON, adds `Authorization: Bearer <token>` when
  `localStorage["kolab_token"]` exists, and throws `ApiError` (with `.status` and `.data`) on non-2xx replies.
  Messages shown to users come from `{ "message": "..." }` in the response body.
* **CORS:** enable CORS on your server, or use the dev proxy: set `VITE_API_BASE_URL=/api`
  and `VITE_DEV_PROXY_TARGET=http://localhost:8000` in `.env`.
* **Login:** this package has no login screen (you asked for the creator side only). After your own login,
  store the token with `localStorage.setItem('kolab_token', token)` and the app will send it.

### What each call should send and return

| Frontend call (`api.*`) | Default method + path | Send | Expect back |
|---|---|---|---|
| `getMe` | GET `/creator/me` | none | `{ name, handle, initials, counts:{ bids, activeJobs, messages } }` |
| `getHome` | GET `/creator/home` | none | `{ totalJobs, matchedTo, needsYou[], money{}, bidsSummary{}, featured:[Job] }` |
| `getJobs` | GET `/jobs` | query: `q, sort (closing, highest, newest), city, platform, category` (comma lists), `minBudget, usualOnly, limit` | `{ items:[Job], total, facets:{ city, platform, category } }` |
| `getJob` | GET `/jobs/:id` | none | Job plus `kind, postBy, closesAt, defaultPostDate, brief, deliver[], rules[], where{}, about{}, last10Avg, similar[]` |
| `toggleSave` | POST `/jobs/:id/save` | none | `{ saved: boolean }` |
| `placeBid` | POST `/jobs/:id/bids` | `{ amount, why, expectedViews, postDate, links[] }` | the created bid |
| `getBids` | GET `/bids` | none | `{ items:[Bid], summary:{ month, total, won } }` |
| `updateBid`, `withdrawBid` | PATCH `/bids/:id`, POST `/bids/:id/withdraw` | `{ amount, why }`, none | updated bid |
| `getActiveJobs`, `getActiveJob` | GET `/active-jobs`, `/active-jobs/:id` | none | list, ActiveJob |
| `submitDraft` | POST `/active-jobs/:id/draft` | **multipart/form-data**: `file`, `note` | `{ ok: true }` |
| `sendMessage` | POST `/messages/:id` | `{ text }` | `{ id, from:"me", time, text }` |
| `getAgreement`, `acceptAgreement`, `declineAgreement` | GET `/agreements/:id`, POST `.../accept`, POST `.../decline` | none, none, `{ reason? }` | agreement, `{ ok }` |
| `getEarnings` | GET `/earnings` | none | `{ bank, payoutDay, balances{}, ledger[], slips{} }` |
| `withdraw` | POST `/earnings/withdraw` | none | `{ amount, bank }` |
| `downloadStatement` | GET `/earnings/statement` | none | file or URL (wire this to a real download) |
| `getThreads` | GET `/messages` | none | `[Thread]` with messages |
| `getProfile`, `updateProfile` | GET and PATCH `/creator/profile` | partial profile | profile |
| `getNotifications`, `markAllRead` | GET `/notifications`, POST `/notifications/read-all` | none | `[{ id, title, body, time, unread }]` |

**The exact shapes are the objects in `src/data/mock.js`.** If your backend uses different field names, map them
inside the matching function in `src/services/api.js` (one place, no page changes).

## 4. Project structure

```
src/
  main.jsx, App.jsx            app entry and routes
  config/env.js, endpoints.js  env values and every backend URL
  services/http.js, api.js     fetch wrapper and all data functions (mock or real)
  data/mock.js                 sample data (also documents the expected shapes)
  hooks/useAsync.js, useMedia.js
  components/                  AppShell (sidebar, mobile tabs), JobCard, Chat, Dialog, Modal, Toast, Icon, ui.jsx
  overlays/                    NotificationsPanel, BidSent, EditProfile
  pages/                       Home, FindJobs, JobDetails, MyBids, ActiveJob, Earnings, Profile, Messages,
                               Agreement, More (mobile menu), Help
  styles/tokens.css            colours, fonts, radii (from the Figma variables)
  styles/global.css, layout.css, pages.css
```

Design tokens (from your Figma "Color palette"): ink `#16181D`, peacock teal `#0E6B66`, marigold `#E9A23B`;
fonts Familjen Grotesk (display), IBM Plex Sans (text), IBM Plex Mono (payout slip). Change them once in
`src/styles/tokens.css`.

## 5. Things to finish on your side

* **Icons** are inline SVGs in `src/components/Icon.jsx`, drawn to match the icon names in the Figma file.
  For the exact Figma artwork, export your icons as SVG and replace the paths there.
* **Real-time chat:** messages are sent with a normal POST. For live updates add a WebSocket or polling call
  in `src/components/Chat.jsx` and `src/pages/Messages.jsx`.
* **Phone numbers and emails in chat** are masked on the frontend for display only. Enforce this on the server too.
* **Draft upload:** the file goes as multipart. For very large videos (up to 500 MB) use a presigned-URL upload.
* **Mobile:** layouts follow the 390px designs (bottom tabs, sheets, stacked panels). Test on a real phone.
* **Animations:** page fade-in, scroll reveals, count-up numbers, budget bars, hover lifts, modal and sheet motion.
  They switch off for users who prefer reduced motion.
* **Deploy:** run `npm run build` and upload `/dist` to any static host (Netlify, Vercel, S3 + CloudFront, Nginx).
  Add a rewrite of all paths to `index.html` (single-page app routing).
