# Local-Only Edition (No Docker)

This package is configured for **local development only** using your macOS MongoDB (MongoDB Compass / mongosh) — **no Docker required**. Follow the commands in ChatGPT's message to run everything from VS Code Terminal.

# Task & User Management API

Production-ready REST API with JWT auth, RBAC, rate limiting, audit logs, Docker.

## Features
- JWT authentication (`/auth/register`, `/auth/login`)
- Roles: `admin`, `manager`, `user`
- Task CRUD with pagination, filtering, sorting
- User CRUD (admin/manager)
- Reports: task status, user performance
- Validation (express-validator)
- Security hardening (helmet, cors, compression)
- Rate limiting (configurable)
- Audit logs persisted to MongoDB
- Dockerfile + docker-compose for local dev

## Quick Start

### Local (no Docker)
1. Copy `.env.example` to `.env` and fill values.
2. Ensure MongoDB is running and `MONGO_URI` is valid.
3. Install deps:
   ```bash
   npm install
   ```
4. Dev mode:
   ```bash
   npm run dev
   ```

### Docker
Build and run:
```bash
docker build -t task-user-api .
docker run --name task-user-api -p 8080:8080 --env-file .env task-user-api
```
Or with docker-compose:
```bash
docker compose up --build
```

## Endpoints (base: `/api/v1`)
- `POST /auth/register`
- `POST /auth/login`
- `POST /users` (admin/manager)
- `GET /users` (admin/manager) ?page&limit&role&active
- `GET /users/:id` (admin/manager)
- `PATCH /users/:id` (admin/manager)
- `DELETE /users/:id` (admin/manager) soft delete
- `POST /tasks` (admin/manager)
- `GET /tasks` (all auth; users see only their own by default)
- `GET /tasks/:id` (owner or admin/manager)
- `PATCH /tasks/:id` (owner or admin/manager)
- `DELETE /tasks/:id` (owner or admin/manager)
- `GET /reports/task-status` (admin/manager)
- `GET /reports/user-performance` (admin/manager)

## Sample cURL
```bash
# register admin
curl -X POST http://localhost:8080/api/v1/auth/register -H 'Content-Type: application/json' -d '{"name":"Admin","email":"admin@example.com","password":"Passw0rd!","role":"admin"}'
# login
curl -X POST http://localhost:8080/api/v1/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@example.com","password":"Passw0rd!"}'
# use token
TOKEN=...
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/tasks
```

## Folder Structure
```
src/
  config/db.js
  controllers/
  middlewares/
  models/
  routes/
  utils/
```

## Notes
- Audit logs are written after successful handlers.
- Basic global rate limiting is applied; adjust env vars as needed.
- Validation rules live in `src/validators`.
- Add tests if required.
```