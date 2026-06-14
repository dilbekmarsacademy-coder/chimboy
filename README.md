# Chimboy — E-commerce Platform

Monorepo for the **Chimboy** Uzbek condiment brand (mayonnaise, ketchup, sauces, mustard, adjika, gift sets).

## Structure

| Folder      | Purpose                                                        |
| ----------- | ------------------------------------------------------------- |
| `frontend/` | React (Vite) + Tailwind storefront. **Active build.**         |
| `backend/`  | API service (planned). Frontend currently uses mock services. |
| `design/`   | Design system, mockups, brand assets.                         |
| `qa/`       | Test plans, e2e tests, QA checklists.                         |

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is fully functional with static mock data. All data access is
isolated in `frontend/src/services/` behind async functions, ready to be
swapped for real `backend/` API calls later.
