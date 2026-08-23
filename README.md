# CodeAlpha Social Media Platform

A full-stack social media platform developed as **Project 2** of the CodeAlpha Full Stack Development internship.

## Features

- User registration and JWT authentication
- User profiles with validated updates
- Posts, comments, likes, follows, and feed
- Persistent notifications
- Real-time notification delivery with Socket.IO
- Request validation and centralized error handling
- Helmet, restricted CORS, body-size limits, and environment validation
- Automated linting, tests, and production client builds through GitHub Actions

## Technology stack

### Frontend
- React
- Vite
- React Router
- Socket.IO Client

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- Socket.IO

## Repository structure

```text
CodeAlpha_SocialMedia/
├── client/       # React frontend
├── server/       # Express API and Prisma
├── docs/         # Project documentation
└── .github/      # CI workflow
```

## Local setup

### Server

```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Configure `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_URL` in `.env`.

### Client

```bash
cd client
npm install
npm run dev
```

Use `VITE_SOCKET_URL` when the API/socket server is not running at `http://localhost:5000`.

## Quality checks

```bash
cd server
npm run lint
npm test

cd ../client
npm run lint
npm run build
```

## Development workflow

`main` remains the stable branch. Current work is pushed to `feature/project-foundation` and can be merged through a pull request when ready.

## Current status

**Phase 9 — Production Hardening: Complete**

## Internship

CodeAlpha — Full Stack Development Internship

Batch: 20 August 2026 to 20 September 2026
