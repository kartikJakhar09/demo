import React from "react";
import { RefreshCw } from "lucide-react";

const PAGE_TITLES = {
  overview: "Pipeline Overview",
  leads:    "Leads CRM",
  kanban:   "Kanban Board",
  ingest:   "Ingest Lead",
  scrape:   "LinkedIn Scrape",
  settings: "Settings",
};

export default function Header({ page, onRefresh, loading, lastUpdated }) {
  return (
    <header style={{
      height: 56,
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "var(--surface)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--text)",
          letterSpacing: "0.02em",
        }}>
          {PAGE_TITLES[page] || "RIOO"}
        </h1>
        <span style={{
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          background: "var(--surface2)",
          padding: "2px 8px",
          borderRadius: 4,
          border: "1px solid var(--border)",
        }}>
          Revenue Engine v2
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {lastUpdated && (
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            width: 7, height: 7,
            borderRadius: "50%",
            background: "var(--green)",
            display: "inline-block",
            animation: "pulse-dot 2s infinite",
          }} />
          <span style={{ fontSize: 11, color: "var(--green)", fontFamily: "var(--font-mono)" }}>live</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: loading ? "var(--text-muted)" : "var(--text)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 10px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            transition: "all 0.15s",
          }}
        >
          <RefreshCw size={13} style={{ animation: loading ? "spin 0.7s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>
    </header>
  );
}
