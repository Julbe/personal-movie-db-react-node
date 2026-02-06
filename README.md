# personal-movie-db-react-node
Full-stack application to search, compare movies and manage a personal watchlist.

## Tech Stack
### Frontend
- React (Hooks)
- Vite
- JavaScript
- Material UI (MUI)
- Testing: Vitest + Testing Library

### Backend
- Node.js (ES Modules)
- Express
- External API: OMDb
- Testing: Jest + Supertest

### DevOps / CI-CD
- GitHub Actions (tests on PR to `main`)
- Vercel (frontend deployment)
- Render (backend deployment)

## Live Demo
[Frontend](https://personal-movie-db-react-node-4837qksnr.vercel.app?_vercel_share=9dS6oZxvIX25PGKSB7omzwHjcEOX74ql)
[Backend](https://personal-movie-db-react-node.onrender.com)


## Environment Variables
### Backend
Create a `.env` file in `backend/`:
```
PORT=3000
OMDB_API_KEY=990ade1e
OMDB_BASE_URL=https://www.omdbapi.com/
NODE_ENV=local
```
### Frontend
Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:3000/api
```
---

##  Run Local
### Backend
```
cd backend
npm install
npm run dev
```
App runs at:
- http://localhost:3000

### Frontend
```
cd frontend
npm install
npm run dev
```
App runs at:
- http://localhost:5173


---

##  Testing
### Backend
```
cd backend
npm test
npm run test:coverage
```
### Frontend
```
cd frontend
npm test
npm run test:coverage
```

##  CI / CD
### GitHub Actions
- Runs frontend tests on: Pull Requests to main-

### Deployment
- Frontend: `Vercel`.  Root Directory: `frontend`. Auto deploy on merge to main.
- Backend: `Render`. Root Directory: `backend`. Auto deploy on commit to main

### Monorepo optimization:
- Frontend deploys only when `frontend/` changes
- Backend deploys only when `backend/` changes