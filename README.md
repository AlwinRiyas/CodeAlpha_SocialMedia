# Connect — Social Media Platform

A full-stack social networking platform built as **Project 2** of the CodeAlpha Full Stack Development Internship.

The project is designed around a simple social loop: **discover people → connect → share posts → interact → receive notifications**.

## ✨ Highlights

- 🔐 JWT-based registration and authentication
- 👤 Public profiles with editable bio and avatar URL
- 🔎 People discovery with search by username, display name, or bio
- 🤝 Connection requests with pending, accept, decline, and duplicate-request handling
- 👥 Follow / unfollow relationships
- 📝 Text posts with comments and likes
- 📰 Social feed with recent activity
- 🔔 Persistent notifications for follows, likes, comments, and connection requests
- ⚡ Real-time notification delivery with Socket.IO
- 🛡️ Centralized validation and error handling
- 🔒 Helmet, restricted CORS, request-size limits, and environment validation
- 🧪 Automated linting, tests, and production client builds through GitHub Actions
- 🌱 Seeded fictional demo network for local development and portfolio demonstrations

## 🧭 Product Flow

```text
                 ┌──────────────┐
                 │   Discover   │
                 └──────┬───────┘
                        │
                 Search / Explore
                        │
                        ▼
                 ┌──────────────┐
                 │    Profile   │
                 └──────┬───────┘
                        │
                 Send Connection
                        │
                        ▼
              ┌──────────────────┐
              │ Request / Accept │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Feed + Social   │
              │ Likes / Comments  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Notifications   │
              └──────────────────┘
```

## 🧱 Architecture

```text
CodeAlpha_SocialMedia/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Auth, feed, profiles, discovery, notifications
│       └── lib/            # API, auth, Socket.IO clients
├── server/                 # Express API
│   ├── prisma/             # Schema, migrations, seed data
│   └── src/
│       ├── middleware/     # Authentication, validation, errors
│       ├── modules/        # Auth, users, posts, follows, connections, etc.
│       └── routes/         # Health and API routing
├── docs/                   # Deployment, operations, and release documentation
└── .github/workflows/      # CI pipeline
```

## 🛠️ Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite |
| API | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Authentication | JWT |
| Real-time | Socket.IO |
| Security | Helmet, CORS, validation middleware |
| Quality | ESLint, Node test runner, GitHub Actions |

## 🚀 Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL
- Git

### 1. Clone

```bash
git clone https://github.com/AlwinRiyas/CodeAlpha_SocialMedia.git
cd CodeAlpha_SocialMedia
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
npm install
```

Set these values in `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/codealpha_socialmedia"
JWT_SECRET="replace-with-a-long-random-secret"
CLIENT_URL="http://localhost:5173"
PORT=5000
NODE_ENV="development"
```

### 3. Initialize the database

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

The seed creates six fictional demo users, sample posts, follows, and a pending connection request.

**Demo password:** `Demo@12345`

Demo usernames:

```text
alexmorgan
sarahwilson
danielkim
mayapatel
ryanthomas
emmadavis
```

### 4. Start the API

```bash
npm run dev
```

API:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health/live
```

### 5. Start the client

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## 🤝 Social Workflow

1. Register or log in.
2. Open **Discover**.
3. Search for people by name, username, or bio.
4. Open a public profile or send a connection request directly.
5. The recipient receives a notification.
6. Accepting a request creates the connection and follow relationship.
7. Connected users can interact through posts, likes, comments, and follows.
8. Social activity appears in the notification center and real-time events are delivered through Socket.IO.

## 🧪 Quality Checks

Server:

```bash
cd server
npm run lint
npm test
npm run prisma:generate
```

Client:

```bash
cd client
npm run lint
npm run build
```

## 🔐 Security Notes

- Passwords are never stored in plaintext; they are derived using Node.js `scrypt` with per-password salts.
- JWT authentication protects private API operations.
- User input is validated before database operations.
- CORS is restricted to the configured client origin.
- Helmet adds standard HTTP security headers.
- Request bodies are size-limited.
- Secrets and database credentials belong in environment variables, not Git.

## 📚 Documentation

- `docs/DEPLOYMENT.md` — deployment guidance
- `docs/OPERATIONS.md` — operational guidance
- `docs/RELEASE_CHECKLIST.md` — release checklist

## 🗺️ Project Status

**Project 2 — Phase 10: Social Discovery & Connections — Complete**

The current branch contains the complete foundation, production-hardening work, and social discovery/connection workflow. `main` is intended to represent the stable portfolio version.

## 🎓 Internship

**CodeAlpha — Full Stack Development Internship**  
Batch: **20 August 2026 – 20 September 2026**

## 📄 License

This project is developed for educational and portfolio purposes.
