# Local-Only Edition (No Docker)

This package is configured for **local development only** using your macOS MongoDB (MongoDB Compass / mongosh) — **no Docker required**. Follow the commands in This README file  to run everything from VS Code Terminal.

# Task User API

Production-ready Task & User Management API (Node.js, Express, MongoDB, JWT, RBAC, rate limiting, audit logs) with local and Docker run modes.

## Quick Start

### Run (Local)
```bash
cp .env.example .env         # then edit MONGO_URI and JWT_SECRET
npm install
npm run dev                  # http://localhost:8080


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
docker run --name task-user-api -p 3000:3000 --env-file .env task-user-api
```
Or with docker-compose:
```bash
docker compose up --build -d # API http://localhost:3000, Mongo on localhost:27018
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
## Seed sample data
```
# local server
npm run seed

# docker API
BASE_URL=http://localhost:3000 npm run seed
# or: npm run seed:docker
```
## Postman

### Files
Import these from the `/postman` folder:
- `postman/Task-User-API.postman_collection.json`
- `postman/Task-User-API-Local.postman_environment.json` *(no real tokens inside)*

### Setup
1. Open Postman → **Import** the two files above.  
2. In the top-right, select environment **Task User API (Local)**.  
   - Local base URL: `http://localhost:8080`  
   - If using Docker, create/select an environment with `baseUrl = http://localhost:3000`.

### Quick workflow
1. **Health** → `GET /health` (sanity check).  
2. **Auth → POST /auth/register (admin)** – run once to create an admin.  
3. **Auth → POST /auth/login (capture token)** – click **Send**.  
   - The request’s **Tests** script saves `{{token}}` for the rest of the collection.  
4. Use **Users** and **Tasks** requests normally (they send `Authorization: Bearer {{token}}`).  
5. Try **Reports**:  
   - `GET /reports/task-status`  
   - `GET /reports/user-performance`

### Environment variables
- `{{baseUrl}}` – `http://localhost:8080` (or `http://localhost:3000` for Docker)
- `{{token}}` – auto-filled after login
- `{{userId}}`, `{{taskId}}` – set these from previous responses to drive `/:id` routes

### (Optional) Helpful Tests snippets

**Save `token` on login (already included in collection):**
```js
// Tests tab of Auth → POST /auth/login
let data = {};
try { data = pm.response.json(); } catch (e) {}
if (data && data.token) {
  pm.environment.set('token', data.token);
  pm.collectionVariables.set('token', data.token);
}


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