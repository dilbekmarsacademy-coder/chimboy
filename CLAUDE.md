# Chimboy Project

E-commerce website for Chimboy — Uzbek condiment brand.
Products: mayonnaise, ketchup, sauces, mustard.

## Conventions
- Languages: Uzbek (default) + Russian
- Currency: UZS
- Commits: conventional commits (feat:, fix:, chore:)

---

## What this is

Monorepo for **Chimboy**, an Uzbek condiment brand storefront. The only active
codebase today is `frontend/` — a React (Vite) + Tailwind SPA backed entirely by
static mock data. `backend/`, `design/`, and `qa/` are placeholders for future work.

## Commands (run inside `frontend/`)

```bash
cd frontend
npm install      # install deps
npm run dev      # start dev server (Vite, port 5173)
npm run build    # production build
npm run lint     # eslint
```

## Architecture

- **Routing**: `react-router-dom` v6. Routes are defined in `src/router/` and
  lazy-loaded with `React.lazy` + `Suspense`. `src/App.jsx` wires the layout +
  routes.
- **State**: Zustand stores in `src/store/` — `cartStore`, `wishlistStore`,
  `authStore`. Cart and wishlist persist to `localStorage`; auth stores a mock
  user object in `localStorage`.
- **Data access**: ALL data flows through async functions in `src/services/`
  (e.g. `productService.js`), which return Promises with a simulated delay and
  read from `src/services/mockData.js`. This is the seam for a real `backend/`
  API later — swap the function bodies, leave components untouched.
- **i18n**: `i18next` + `react-i18next`. Locales in `src/locales/{uz,ru}.json`.
  UZ is default. Language persists to `localStorage` (`chimboy_lang`). Product
  content uses `name_uz`/`name_ru` style fields via the `localized()` helper in
  `src/utils/helpers.js`. **No hardcoded UI strings** — always use `t()`.
- **UI kit**: reusable primitives in `src/components/ui/`, layout in
  `src/components/layout/`, homepage blocks in `src/components/sections/`.
- **Styling**: Tailwind with custom brand tokens in `tailwind.config.js`
  (`primary`, `accent`, etc.). Container helper class: `container-x`.
- **Animation**: `framer-motion` for sliders, scroll reveals, counters, modals.
- **Maps**: `react-leaflet` + OpenStreetMap on the Stores page.
- **Toasts**: `react-hot-toast` (configured in `src/main.jsx`).

## Conventions

- Money is UZS; format with `formatPrice()` from `src/utils/helpers.js`.
- Mock auth: any email + password `chimboy123` logs in. Promo codes:
  `CHIMBOY10` (-10%), `SUMMER20` (-20%). Free delivery over 150,000 UZS,
  otherwise 15,000 UZS.
- Keep new data behind a service function; never import `mockData.js` directly
  into a component.
