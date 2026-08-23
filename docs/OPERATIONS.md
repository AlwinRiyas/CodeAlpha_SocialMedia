# Operations Guide

## Health checks

- Liveness: `GET /api/health/live`
- Readiness: `GET /api/health`

Use the liveness endpoint for process checks and the readiness endpoint when database connectivity must also be verified.

## Startup

Development:

```bash
cd server
npm run dev
```

Production:

```bash
cd server
npm start
```

## Database migrations

Development:

```bash
npm run prisma:migrate
```

Production:

```bash
npx prisma migrate deploy
```

Never use `prisma migrate dev` against the production database.

## Shutdown

The server handles `SIGINT` and `SIGTERM`, closes Socket.IO, then closes the HTTP server. The deployment platform should allow the process to terminate gracefully.

## Incident checks

1. Check `/api/health/live`.
2. Check `/api/health` for database availability.
3. Verify environment variables are present.
4. Check deployment and application logs.
5. Verify `CLIENT_URL` and client API/socket environment variables after domain changes.
