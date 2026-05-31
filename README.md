# DSA Games

A gamified platform for learning Data Structures and Algorithms through interactive puzzle games.

## Features

- Interactive DSA games: Alter Stack and BSTree
- User authentication and profiles
- Server-validated score submissions
- Game history, progress stats, leaderboards, and achievements
- Dockerized backend and frontend for reproducible local/demo environments

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: access tokens plus rotating refresh tokens
- Database: MongoDB Atlas or local MongoDB
- Deployment-ready options: Docker, Render/Railway/Fly, Vercel, Github actions for Docker build

## Local Development

Run backend and frontend separately:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Frontend local env:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Backend local env:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dsa-games
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ACCESS_TOKEN_SECRET=replace-with-a-long-random-access-secret
REFRESH_TOKEN_SECRET=replace-with-a-long-random-refresh-secret
ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_SECONDS=2592000
```

## Docker Demo

Run the full stack with MongoDB, backend, and frontend:

```bash
docker compose up --build
```

Open:

```txt
Frontend: http://localhost:8080
Backend:  http://localhost:5000/api/health
MongoDB:  mongodb://localhost:27017/dsa-games
```

Stop containers:

```bash
docker compose down
```

Remove local MongoDB volume:

```bash
docker compose down -v
```

## Production Deployment

Recommended resume-friendly deployment:

- Frontend: Vercel
- Backend: Docker web service on Render, Railway, or Fly.io
- Database: MongoDB Atlas

Backend production environment variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your-production-mongodb-uri
CORS_ORIGINS=https://your-frontend-domain.com
ACCESS_TOKEN_SECRET=long-random-secret
REFRESH_TOKEN_SECRET=different-long-random-secret
ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_SECONDS=2592000
```

Frontend production environment variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## API Highlights

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/games`
- `POST /api/game-sessions`
- `POST /api/scores`
- `GET /api/users/me/progress`
- `GET /api/leaderboards/:gameSlug/:difficulty`

## Resume Bullet

Built and deployed a full-stack DSA gaming platform with React, Node.js, Express, MongoDB, rotating-token auth, server-validated scoring, leaderboards, achievements, and Dockerized deployment.

## License

This project is licensed under the terms described in the `LICENSE` file. All rights are reserved by the author.
