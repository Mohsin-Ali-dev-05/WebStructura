# WebStructura — AI-Powered Website Builder

A university Web Engineering project: a MERN app that lets signed-in users create, edit, preview, publish, and export simple websites. Local **Ollama** powers optional AI drafts — both when creating a blank project and inside the builder (SSE streaming).

**Live demo:** [webstructura.netlify.app](https://webstructura.netlify.app)

## Features

- **Auth** — Email/password (JWT + bcrypt), Google OAuth (Passport), forgot/reset password via SMTP; protected routes prompt guests to sign in
- **Dashboard** — Create, list, edit, and delete projects
- **Blank AI create** — From **New project** (no template), Ollama drafts a full niche site (Hero, Features, About, Testimonials, FAQ, CTA, Contact, Footer). Expect **1–2 minutes**; keep the tab open
- **Templates** — Industry starters (SaaS, portfolio, cafeteria, storefront, real estate, tech blog, blank canvas) that open in the builder
- **Schema-driven builder** — Edit structured `websiteData` (theme + components); no `eval()`
- **AI assistant** — Refine or regenerate sections via Ollama (`/api/ai/generate-stream`) with a live terminal overlay
- **Topic images** — AI `imageKeyword` tags map to stable Unsplash photos for that niche (food, real estate, SaaS, etc.) so previews are not blank or broken
- **Responsive site blocks** — Shared design tokens for Navbar → Footer; mobile/tablet/desktop preview frames
- **Public share** — Published sites at `/view/:id` (no app chrome)
- **Export** — Download a React + Tailwind ZIP (`GET /api/projects/:id/export`)
- **Settings** — Profile (avatar), account, security, appearance (local UI preferences), notifications, billing (placeholder UI)
- **Marketing site** — Home, About, Contact, Terms, Privacy, FAQ anchors

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, React Router, Framer Motion, Lucide, react-hot-toast |
| Backend | Node.js (ESM), Express, Mongoose |
| Database | MongoDB |
| Auth | JWT, Passport Google OAuth 2.0, express-session |
| AI | Local Ollama HTTP API |
| Media | Cloudinary (avatars) or local `server/uploads/` in dev; site photos via Unsplash CDN |
| Email | Nodemailer (SMTP / Gmail App Password) |

## Project structure

```text
client/                 React frontend (Vite)
  src/
    pages/              Marketing, auth, dashboard, builder, settings
    website/            Renderer, templates, topic image helpers, section components
    preferences/        Local UI preferences (appearance)
server/                 Express API
  src/
    config/             env, passport, db
    controllers/        route handlers
    models/             User, Project
    routes/             auth, projects, ai, users, contact, oauth
    services/           Ollama AI, topicImages, avatars, mail, export
```

## Prerequisites

- Node.js **18+** and npm
- MongoDB Community Server (local) or Atlas
- **Ollama** (optional, for AI generation) with a chat model, e.g. `qwen2.5:3b`
- Google Cloud OAuth credentials (optional, for “Sign in with Google”)
- SMTP credentials (optional, for password reset and contact form)

## Setup

### 1. MongoDB (Windows)

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) if needed.
2. Start the service (**Services** → **MongoDB**, or `net start MongoDB` in elevated PowerShell).
3. Confirm with `mongosh`, then `exit`.

Default local URI: `mongodb://127.0.0.1:27017/webstructura`

### 2. Backend

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

Edit `server/.env` before starting. The API listens on `http://localhost:5000`.

| Variable | Required | Purpose |
|---|---|---|
| `DB_URI` or `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Signs auth tokens |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `PORT` | No | API port (default `5000`) |
| `CLIENT_ORIGIN` | No | Extra CORS origins (comma-separated); localhost + Netlify are always allowed |
| `SESSION_SECRET` | No | Passport session (falls back to `JWT_SECRET`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | For Google login | OAuth redirect: `http://localhost:5000/auth/google/callback` |
| `OLLAMA_BASE_URL` | No | Default `http://localhost:11434` |
| `OLLAMA_MODEL` | No | Default `qwen2.5:3b` |
| `SMTP_USER` / `SMTP_PASS` | For email | Gmail App Password recommended |
| `SUPPORT_EMAIL` | No | Contact form inbox |
| `CLOUDINARY_*` | Prod avatars | Dev falls back to local uploads |
| `PUBLIC_API_URL` | No | Base URL for local avatar links |

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App: `http://localhost:5173`. Vite proxies `/api` (and auth) to the Express server.

### 4. Ollama (AI drafts)

```bash
ollama pull qwen2.5:3b
ollama serve
```

Without Ollama, templates, editing, preview, and export still work. Blank-project AI create and builder AI endpoints need a reachable model (first run can take **1–2 minutes**).

## Health check

```bash
curl http://localhost:5000/api/health
```

Expect `database.state: "connected"`. If MongoDB is down, the server exits on startup with a clear `[db] Failed to connect` message.

## Main UI routes

| Path | Access | Purpose |
|---|---|---|
| `/` | Public | Marketing home |
| `/login`, `/register` | Public | Auth (email + Google) |
| `/forgot-password`, `/reset-password/:token` | Public | Password recovery |
| `/dashboard` | Auth | Project list |
| `/templates` | Auth | Template gallery |
| `/projects/new`, `/projects/:id/edit` | Auth | Create (template or AI blank) / edit metadata |
| `/projects/:id/builder` | Auth | AI + preview + editor |
| `/projects/:id/preview` | Auth | Full-page preview |
| `/view/:id` | Public | Shared published site |
| `/settings/*` | Auth | Profile, account, security, appearance, notifications, billing |
| `/about`, `/contact`, `/terms`, `/privacy` | Public | Site pages |

### Builder layout

- **Left:** AI assistant (prompt → streamed JSON)
- **Center:** Live website preview (desktop / tablet / mobile)
- **Right:** Component / theme editor

On narrow screens: AI / Preview / Editor tabs.

## Website data schema

Projects store structured JSON in `websiteData` (not executable code):

```json
{
  "title": "Bakery Site",
  "theme": {
    "primaryColor": "#059669",
    "backgroundColor": "#ffffff",
    "textColor": "#14213d",
    "font": "Georgia, serif"
  },
  "components": [
    {
      "id": "uuid",
      "type": "Hero",
      "props": {
        "title": "Fresh every morning",
        "subtitle": "Neighborhood bakery",
        "layout": "split",
        "imageKeyword": "bakery,food",
        "imageAlt": "Fresh bread on a counter"
      }
    }
  ]
}
```

`ComponentRenderer` maps `components[]` to whitelisted React sections (Navbar, Hero, About, Services, Projects, Testimonials, Pricing, FAQ, Gallery, CTA, Contact, Footer, …). Unknown types are skipped.

`imageKeyword` values are resolved server-side (and in the client renderer) to niche-matched Unsplash URLs via `topicImages` — do not invent placeholder image hosts.

## API overview

### Auth

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create user + JWT |
| POST | `/api/auth/login` | No | Login + JWT |
| GET | `/api/auth/me` | JWT | Current user |
| PUT | `/api/auth/me` | JWT | Update profile fields |
| POST | `/api/auth/forgotpassword` | No | Email reset link |
| PUT | `/api/auth/resetpassword/:token` | No | Set new password |
| GET | `/auth/google` | No | Start Google OAuth |
| GET | `/auth/google/callback` | No | OAuth callback → client with token |
| GET | `/api/current_user` | Session | Session user (OAuth) |
| GET | `/api/logout` | Session | End Passport session |

### Projects

All owner routes require a Bearer JWT. Users only access their own projects.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/projects` | Create (optional AI draft when no template `websiteData`) |
| GET | `/api/projects` | List mine |
| GET | `/api/projects/:id` | Get one |
| PUT | `/api/projects/:id` | Update |
| DELETE | `/api/projects/:id` | Delete |
| GET | `/api/projects/:id/export` | ZIP export (React/Tailwind) |
| GET | `/api/projects/public/:id` | Public payload for `/view/:id` |

### AI, users, contact

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/ai/generate` | Generate website JSON (blocking) |
| POST | `/api/ai/generate-stream` | SSE stream for the builder terminal |
| POST | `/api/ai/test` | Connectivity check to Ollama |
| PUT | `/api/users/me` | Profile updates |
| POST | `/api/users/me/avatar` | Upload avatar |
| DELETE | `/api/users/me/avatar` | Remove avatar |
| POST | `/api/contact` | Contact form → support email |

## Scripts

| Location | Command | Purpose |
|---|---|---|
| `server` | `npm run dev` | API with Node `--watch` |
| `server` | `npm start` | API without watch |
| `client` | `npm run dev` | Vite dev server |
| `client` | `npm run build` | Production build |
| `client` | `npm run preview` | Preview production build |

## Intentionally limited / demo

- Billing, teams, custom domains, and hosted deployment pipelines
- Notifications and some security controls are UI demos only; appearance prefs persist locally
- AI quality and speed depend on the local Ollama model and machine

## License

University Web Engineering coursework project.
