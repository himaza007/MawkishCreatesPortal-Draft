# Mawkish Creates — Internal Staff Portal

**Version 1.0 | 2026**

A full-stack internal portal for Mawkish Creates staff. Tasks, announcements, calendar, pipelines, and resources — all in brand.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express |
| Database | NeDB (embedded, file-based) |
| Auth | Session-based (express-session) + bcryptjs |
| Frontend | Vanilla HTML/CSS/JS (multi-page) |
| Fonts | Playfair Display + DM Sans (Google Fonts) |

---

## Setup

```bash
npm install
npm start
```

Portal opens at: **http://localhost:3000**

**Default login:**  
Email: `admin@mawkish.com`  
Password: `mawkish2026`

---

## Project Structure

```
mawkish-portal/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── db/
│   │   ├── database.js        # NeDB init + seed data
│   │   └── data/              # Auto-created DB files
│   └── routes/
│       ├── auth.js
│       ├── tasks.js
│       ├── announcements.js
│       ├── events.js
│       ├── pipelines.js
│       └── resources.js
├── frontend/
│   ├── index.html             # Login page
│   ├── css/
│   │   ├── variables.css      # Brand CSS variables
│   │   ├── main.css           # App-wide styles
│   │   └── login.css          # Login page styles
│   ├── js/
│   │   └── shell.js           # Shared nav + utilities
│   ├── pages/
│   │   ├── dashboard.html
│   │   ├── tasks.html
│   │   ├── calendar.html
│   │   ├── announcements.html
│   │   ├── pipelines.html
│   │   └── resources.html
│   └── assets/
│       └── logo.png           ← REPLACE WITH YOUR LOGO
├── package.json
└── README.md
```

---

## Logo

Place your logo file at:
```
frontend/assets/logo.png
```
The sidebar will automatically use it. If the file is missing, a text fallback is shown.

---

## Adding Staff Accounts

Log in as admin and use the API directly (or extend the portal with a `/pages/admin.html` user management page):

```bash
curl -X POST http://localhost:3000/api/auth/users \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"name":"Jane Doe","email":"jane@mawkish.com","password":"pass1234","role":"staff","department":"Creative"}'
```

---

## Brand Colours

Defined in `frontend/css/variables.css` — exact match to Brand Guidelines V1:

- **Primary:** Purple 700 `#420f8a`
- **Sidebar:** Purple 950 `#0d0120`  
- **Accent:** Gold `#c9a84c` · Rose `#e879b0` · Cyan `#5eead4`
- **Background:** Purple 50 `#f8f4ff`

---

## Development Workflow (React + Vite frontend)

**First time setup:**
```bash
npm run setup
npm start
```

**During development (hot reload):**

Terminal 1 — backend:
```bash
npm start
```

Terminal 2 — frontend dev server with hot reload:
```bash
cd frontend
npm run dev
# → http://localhost:5173  (proxies API to :3000)
```

**Build for production:**
```bash
npm run build
npm start
# → http://localhost:3000
```
