# Deployment Guide

## Architecture

Deploy the React client as a static application and the Express/Socket.IO server as a Node.js service. Use a managed PostgreSQL database accessible through `DATABASE_URL`.

## Server environment

```text
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=<long-random-secret>
CLIENT_URL=https://your-client-domain
```

Generate the Prisma client during deployment:

```bash
npm install
npm run prisma:generate
npm start
```

Apply database migrations using the deployment platform's release/build process:

```bash
npx prisma migrate deploy
```

Do not run `prisma migrate dev` in production.

## Client environment

```text
VITE_API_URL=https://your-api-domain/api
VITE_SOCKET_URL=https://your-api-domain
```

Build the client:

```bash
npm install
npm run build
```

Deploy the generated `dist/` directory to a static hosting provider.

## Pre-release checklist

- [ ] CI passes for server and client
- [ ] `JWT_SECRET` is unique and not committed
- [ ] Production `DATABASE_URL` is configured
- [ ] `CLIENT_URL` matches the deployed frontend exactly
- [ ] `VITE_API_URL` and `VITE_SOCKET_URL` use HTTPS in production
- [ ] Prisma migrations are applied with `prisma migrate deploy`
- [ ] Health endpoint responds successfully
- [ ] Authentication, posts, comments, follows, likes, and notifications are manually tested
- [ ] Real-time notification connection is tested after login

## Release workflow

1. Update `feature/project-foundation`.
2. Pull and test locally.
3. Confirm GitHub Actions checks pass.
4. Open a pull request from `feature/project-foundation` to `main`.
5. Review the changes and merge only when the checks are green.
6. Tag a release after deployment if a versioned release is required.
