# Release Checklist

Use this checklist before merging `feature/project-foundation` into `main`.

## Local verification

```bash
cd server
npm install
npm run lint
npm test

cd ../client
npm install
npm run lint
npm run build
```

## Functional verification

- [ ] Register a new user
- [ ] Log in and log out
- [ ] Create and delete a post
- [ ] Add a comment
- [ ] Like and unlike a post
- [ ] Follow and unfollow a user
- [ ] Update profile information
- [ ] Verify persistent notifications
- [ ] Verify real-time notification delivery after login
- [ ] Verify `/api/health/live`
- [ ] Verify `/api/health` with database connectivity

## Security verification

- [ ] No `.env` file or secrets are committed
- [ ] Production `JWT_SECRET` is unique and strong
- [ ] Production CORS origin matches the deployed client exactly
- [ ] Invalid payloads return validation errors
- [ ] Socket.IO rejects unauthenticated connections

## GitHub verification

- [ ] Local branch is up to date
- [ ] GitHub Actions checks are green
- [ ] Pull request targets `main`
- [ ] Branch diff has been reviewed

## Release

1. Merge only after all checks pass.
2. Deploy server and apply `prisma migrate deploy`.
3. Deploy the client with production API and socket URLs.
4. Run health checks.
5. Perform a post-deployment smoke test.
6. Create a version tag or GitHub release if required.
