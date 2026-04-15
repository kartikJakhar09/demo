# RIOO Revenue Engine Dashboard

A production-grade dashboard for the RIOO Revenue Engine n8n workflow (v2).

## Features

| Section | Webhook | Description |
|---|---|---|
| Pipeline Overview | `GET /dashboard-stats` | KPI cards, funnel chart, temperature donut |
| Leads CRM | `GET /dashboard-leads` | Searchable + filterable leads table with expand |
| Kanban Board | `GET /dashboard-leads` + `POST /update-stage` | Drag & drop stage management |
| Ingest Lead | `POST /ingest-lead` | Manual lead form → AI qualification |
| LinkedIn Scrape | `POST /ingest-apify` | Trigger Apify scrape with URL + max leads |
| Settings | — | Configure base URL + endpoint reference |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your n8n URL
```bash
cp .env.example .env
```
Edit `.env` and set:
```
REACT_APP_N8N_BASE_URL=https://your-n8n-instance.com/webhook
```

### 3. Start development server
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production
```bash
npm run build
```
Deploy the `build/` folder to any static host (Vercel, Netlify, S3, etc.)

---

## Deploy on Vercel (Recommended)

1. Push to GitHub
2. Import into [vercel.com](https://vercel.com)
3. Add environment variable: `REACT_APP_N8N_BASE_URL`
4. Deploy ✓

## Deploy on Netlify

1. `npm run build`
2. Drag `build/` folder into [netlify.com/drop](https://netlify.com/drop)
3. Set env var in Site Settings → Environment Variables

---

## Webhook Endpoints Used

All endpoints derive from your `REACT_APP_N8N_BASE_URL`:

```
GET  {BASE_URL}/dashboard-stats   → Pipeline KPIs
GET  {BASE_URL}/dashboard-leads   → All leads
POST {BASE_URL}/update-stage      → { id, stage }
POST {BASE_URL}/ingest-lead       → { name, email, company, title, profile_url, pain_point }
POST {BASE_URL}/ingest-apify      → { linkedin_url, max_leads }
```

---

## Tech Stack

- React 18
- Recharts (charts)
- Lucide React (icons)
- JetBrains Mono + Syne (fonts)
- Zero UI framework — pure CSS-in-JS
