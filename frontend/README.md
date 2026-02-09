# Frontend – Personal Movie DB
React frontend built with Vite and Material UI.
---

## Tech Stack
- React (Hooks)
- Vite
- JavaScript
- Material UI (MUI)
- Vitest + Testing Library
- React Router


## Project Structure

```
src/
 ├─ api/              # API clients
 ├─ components/       # Reusable UI components
 ├─ context/          # Global state (Watchlist)
 ├─ pages/            # Route pages
tests/                # Unit & integration tests. Mirror from src/
 ```


## Environment Variables

Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:3000/api
```
---

##  Run Local

```
cd frontend
npm install
npm run dev
```
App runs at:
- http://localhost:5173