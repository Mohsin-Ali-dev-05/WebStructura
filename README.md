# AI-Powered Website Builder

A university Web Engineering project: a MERN application that will let a signed-in user create, edit, preview, and publish simple websites. Local AI (Ollama) will be added later as an optional draft helper.

This repository is a MERN starter with MongoDB connection, JWT authentication, project CRUD, and a schema-driven website builder. Local AI (Ollama) will be added in a later step.

## Tech stack

- **MongoDB** with Mongoose
- **Express** (Node.js, ES modules)
- **React** with Vite
- REST API

## Project structure

```text
client/                 React frontend
server/                 Express backend
```

## Prerequisites

- Node.js 18 or newer
- MongoDB Community Server (local) or a MongoDB Atlas free cluster
- npm

Ollama is **not** required for this starter.

## Setup

### 1. Start MongoDB locally (Windows)

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) if needed.
2. Start the service (one of these):
   - **Services** app → start **MongoDB**
   - Or in an elevated PowerShell: `net start MongoDB`
3. Confirm the shell works: `mongosh` (you should see a `test>` prompt; type `exit` to leave).

Default local URI (no password): `mongodb://127.0.0.1:27017/ai-website-builder`

### 2. Backend

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

`MONGO_URI` is **required** in `server/.env`. The server connects to MongoDB on startup and exits with an error if the connection fails.

The API listens on `http://localhost:5000`.

Environment variables (see `server/.env.example`):

- `MONGO_URI` — MongoDB connection string (**required**)
- `JWT_SECRET` — secret used to sign tokens (**required**)
- `JWT_EXPIRES_IN` — token lifetime (default `7d`)
- `PORT` — API port (default `5000`)
- `NODE_ENV` — `development` or `production`
- `CLIENT_ORIGIN` — frontend origin for CORS (`http://localhost:5173`)

### 3. Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The app is at `http://localhost:5173`. Vite proxies `/api` to the Express server.

## Health check / verify MongoDB

```bash
curl http://localhost:5000/api/health
```

When MongoDB is connected:

```json
{
  "success": true,
  "message": "AI-Powered Website Builder API is running",
  "data": {
    "service": "server",
    "timestamp": "2026-09-27T00:00:00.000Z",
    "database": {
      "state": "connected",
      "readyState": 1,
      "name": "ai-website-builder",
      "host": "127.0.0.1"
    }
  }
}
```

If MongoDB is down, `npm run dev` should fail at startup with a clear `[db] Failed to connect` message. The home page also displays the health response.

## Authentication API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create user, return JWT |
| POST | `/api/auth/login` | No | Login, return JWT |
| GET | `/api/auth/me` | Bearer JWT | Current user profile |

Passwords are hashed with **bcryptjs**. Responses never include `passwordHash`. Logout is handled on the frontend by clearing the stored JWT (stateless auth).

UI routes: `/register`, `/login`, `/dashboard` (protected), `/projects/new`, `/projects/:id/edit`, `/projects/:id/builder`, `/projects/:id/preview`.

The builder workspace layout:

- **Left:** AI Assistant panel (UI only until Ollama is connected)
- **Center:** live website preview
- **Right:** component/settings editor

On narrow screens, use the AI / Preview / Editor tabs.

## Website builder schema

Projects store structured JSON in `websiteData` (not executable code):

```json
{
  "title": "Bakery Site",
  "theme": {
    "primaryColor": "#1d4ed8",
    "backgroundColor": "#ffffff",
    "textColor": "#14213d",
    "font": "Georgia, serif"
  },
  "components": [
    {
      "id": "uuid",
      "type": "Hero",
      "props": {
        "title": "Software Engineer",
        "subtitle": "Building modern web applications"
      }
    }
  ]
}
```

## Component renderer

`ComponentRenderer` maps `websiteData.components[]` → whitelisted React sections (Hero, Services, Pricing, FAQ, Gallery, CTA, …). Unknown types are skipped (no `eval()`).

New SaaS sections:

- **Pricing** — CSS Grid of tiers; highlights the `Pro` tier (or `featuredTier`)
- **FAQ** — `<details>` / `<summary>` accordion with open transitions
- **Gallery** — responsive auto-fit / spanning image grid from URL props
- **CTA** — high-contrast conversion banner

Live preview (`PreviewViewport`) toggles **Desktop / Tablet / Mobile** frames using relative widths (`100%`, `min(100%, 48rem)`, `min(100%, 24rem)`).

## Projects API

All project routes require a Bearer JWT. Users can only read or change their own projects.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List my projects |
| GET | `/api/projects/:id` | Get one of my projects |
| PUT | `/api/projects/:id` | Update my project |
| DELETE | `/api/projects/:id` | Delete my project |

Project fields: `userId`, `name`, `description`, `status` (`draft` \| `published`), `websiteData`, timestamps.

## Scripts

| Location | Command | Purpose |
|---|---|---|
| `server` | `npm run dev` | Start API with Node `--watch` |
| `server` | `npm start` | Start API without watch |
| `client` | `npm run dev` | Vite development server |
| `client` | `npm run build` | Production build |
| `client` | `npm run preview` | Preview the production build |

## What is intentionally missing

- Public published pages
- Ollama / AI generation
- Social login / OAuth
- Payments, teams, custom domains, and deployment tooling
