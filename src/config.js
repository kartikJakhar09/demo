// ─────────────────────────────────────────────────────────────
//  RIOO Revenue Engine — Webhook Configuration
//  Replace BASE_URL with your n8n instance URL
// ─────────────────────────────────────────────────────────────

export const BASE_URL = process.env.REACT_APP_N8N_BASE_URL || "https://your-n8n-instance.com/webhook";

export const WEBHOOKS = {
  // READ endpoints
  DASHBOARD_STATS:  `${BASE_URL}/dashboard-stats`,
  DASHBOARD_LEADS:  `${BASE_URL}/dashboard-leads`,

  // WRITE endpoints
  UPDATE_STAGE:     `${BASE_URL}/update-stage`,
  INGEST_LEAD:      `${BASE_URL}/ingest-lead`,
  INGEST_APIFY:     `${BASE_URL}/ingest-apify`,
};

export const STAGES = ["New", "Qualified", "Contacted", "Replied", "Interested", "Booked", "Closed"];

export const STAGE_COLORS = {
  New:        "#3b82f6",
  Qualified:  "#8b5cf6",
  Contacted:  "#f59e0b",
  Replied:    "#06b6d4",
  Interested: "#10b981",
  Booked:     "#f97316",
  Closed:     "#22c55e",
};

export const TEMP_COLORS = {
  hot:  "#ef4444",
  warm: "#f97316",
  cold: "#3b82f6",
};
