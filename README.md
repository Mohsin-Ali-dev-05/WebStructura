# WebStructura — AI-Powered Website Builder

**University of Engineering and Technology, Taxila** · Software Engineering · Web Engineering Lab (Session: 2k24)

A full-stack, AI-driven website builder on the **MERN stack**. Users design, customize, and preview professional SaaS-style landing pages in an interactive workspace, with optional local AI drafting via **Ollama**.

**Live demo:** [webstructura.netlify.app](https://webstructura.netlify.app)

---

## Project overview

**WebStructura** lets signed-in users create projects from industry templates or a blank canvas, edit structured website JSON in a schema-driven builder, preview on desktop / tablet / mobile frames, publish a public share link, and export a React + Tailwind ZIP. Local Ollama generates niche-aware copy and layout JSON without sending prompts to a cloud LLM.

---

## Architecture

| Layer        | Technology                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, React Router, Tailwind-style design tokens / utilities, Framer Motion, Lucide |
| **Backend**  | Node.js (ESM), Express                                                                        |
| **Database** | MongoDB (Mongoose)                                                                            |
| **Auth**     | JWT + bcrypt, Passport Google OAuth 2.0                                                       |
| **Styling**  | Tailwind CSS patterns (hand-mirrored utilities in app CSS + generated site CSS)               |
| **AI**       | Local **Ollama** with **Qwen2.5-3B** (`qwen2.5:3b`)                                           |

```text
client/     React + Vite UI (marketing, auth, dashboard, builder, settings)
server/     Express API (auth, projects, AI, users, contact, export)
```

---

## Development status

| Area                                                                                                           | Status                                                                            |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Premium SaaS **editor UI** (app shell, left AI / copilot sidebar, right properties panel, live device preview) | **100% complete**                                                                 |
| Layout responsiveness (desktop / tablet / mobile builder chrome)                                               | **Complete**                                                                      |
| Presentation layer                                                                                             | **DRY-refactored** (shared design tokens, section components, mirrored utilities) |
| Templates + blank AI create + public view + ZIP export                                                         | Implemented                                                                       |
| Billing / teams / hosted deploy                                                                                | Intentionally demo / out of scope                                                 |

---

## Local setup (spin up in December)

### Prerequisites

- Node.js **18+** and npm
- MongoDB running locally (or Atlas URI in `server/.env`)
- **Ollama** installed, with model `qwen2.5:3b` pulled (for AI features)

### 1. Backend

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

API: `http://localhost:5000`  
Fill in `DB_URI` / `JWT_SECRET` (and optional Google / SMTP / Cloudinary) in `server/.env`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App: `http://localhost:5173` (Vite proxies `/api` to the backend).

### 3. Ollama (AI)

```bash
ollama pull qwen2.5:3b
ollama serve
```

### AI configuration note

> **Warning:** Ensure local Ollama **context length is set to 8k** to prevent hardware freezing and layout truncation during generation.

Without Ollama, templates, manual editing, preview, and export still work; blank-project AI create and builder AI streams require a reachable model (generation often takes **1–2 minutes**).

### Health check

```bash
curl http://localhost:5000/api/health
```

Expect `database.state: "connected"`.

---

## Main routes

| Path                                       | Access | Purpose                          |
| ------------------------------------------ | ------ | -------------------------------- |
| `/`                                        | Public | Marketing home                   |
| `/login`, `/register`                      | Public | Auth                             |
| `/dashboard`                               | Auth   | Projects                         |
| `/templates`                               | Auth   | Template gallery                 |
| `/projects/new`                            | Auth   | Create (template or AI blank)    |
| `/projects/:id/builder`                    | Auth   | Editor + AI + live preview       |
| `/projects/:id/preview`                    | Auth   | Full preview                     |
| `/view/:id`                                | Public | Published site                   |
| `/settings/*`                              | Auth   | Profile, security, appearance, … |
| `/about`, `/contact`, `/terms`, `/privacy` | Public | Site pages                       |

### Builder chrome

- **Left:** AI / copilot sidebar
- **Center:** Live multi-device preview
- **Right:** Properties / component panel

Narrow viewports use tabbed AI / Preview / Editor.

---

## Website data (short)

Projects store structured `websiteData` (theme + `components[]`). Whitelisted section types (Navbar, Hero, About, Services, …) render via `ComponentRenderer`. AI `imageKeyword` values map to niche Unsplash photos. See schema notes in git history / builder source if you need the full prop shapes.

---

## Scripts

| Location | Command         | Purpose            |
| -------- | --------------- | ------------------ |
| `server` | `npm run dev`   | API with `--watch` |
| `server` | `npm start`     | API                |
| `client` | `npm run dev`   | Vite               |
| `client` | `npm run build` | Production build   |

---

## License

University Web Engineering coursework project · UET Taxila.
