import React from "react";

export default function StatCard({ label, value, sub, accent, icon: Icon, delay = 0 }) {
  return (
    <div
      className={`fade-up fade-up-${delay}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hi)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* Accent glow */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle, ${accent || "var(--accent)"}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>{label}</span>
        {Icon && (
          <div style={{
            width: 30, height: 30,
            borderRadius: "var(--radius-sm)",
            background: `${accent || "var(--accent)"}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: accent || "var(--accent)",
          }}>
            <Icon size={14} />
          </div>
        )}
      </div>

      <div style={{
        fontFamily: "var(--font-head)",
        fontWeight: 800,
        fontSize: 32,
        color: "var(--text)",
        lineHeight: 1,
      }}>{value}</div>

      {sub && (
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{sub}</div>
      )}
    </div>
  );
}
