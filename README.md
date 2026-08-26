# CodeAlpha Social Media Platform

A full-stack social media platform developed as **Project 2** of the CodeAlpha Full Stack Development internship.

## Features

- User registration and JWT authentication
- User profiles with validated updates
- People discovery with search by name, username, or bio
- Suggested people ranked by community activity
- Connection requests with accept/decline workflow
- Mutual connection creation after acceptance
- Posts, comments, likes, follows, and feed
- Persistent notifications for social activity and connection requests
- Real-time notification delivery with Socket.IO
- Request validation and centralized error handling
- Helmet, restricted CORS, body-size limits, and environment validation
- Seeded demo network for local development and portfolio demonstrations
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
npm run seed
npm run dev
```

Configure `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_URL` in `.env`.

The seed creates six fictional developer/design/technology accounts, sample posts, follows, and a pending connection request. Demo password: `Demo@12345`.

### Client

```bash
cd client
npm install
npm run dev
```

Use `VITE_SOCKET_URL` when the API/socket server is not running at `http://localhost:5000`.

## Social workflow

1. Open **Discover** to browse suggested people.
2. Search by name, username, or bio.
3. Open a profile or use **Connect** directly from a person card.
4. The recipient receives a connection request notification.
5. The recipient accepts or declines from **Discover → Connection requests**.
6. Accepted requests create a mutual connection and follow relationship.
7. Continue interacting through posts, likes, comments, follows, and notifications.

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

**Phase 10 — Social Discovery & Connections: Complete**

## Internship

CodeAlpha — Full Stack Development Internship

Batch: 20 August 2026 to 20 September 2026
