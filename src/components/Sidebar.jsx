import React from "react";
import { BarChart2, Users, Kanban, PlusCircle, Zap, Settings } from "lucide-react";

const NAV = [
  { id: "overview",  icon: BarChart2,   label: "Pipeline" },
  { id: "leads",     icon: Users,       label: "Leads CRM" },
  { id: "kanban",    icon: Kanban,      label: "Kanban" },
  { id: "ingest",    icon: PlusCircle,  label: "Add Lead" },
  { id: "scrape",    icon: Zap,         label: "LinkedIn Scrape" },
  { id: "settings",  icon: Settings,    label: "Settings" },
];

export default function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 64,
      minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 20,
      paddingBottom: 20,
      gap: 4,
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Logo mark */}
      <div style={{
        width: 36, height: 36,
        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-head)",
        fontWeight: 800, fontSize: 14, color: "#fff",
        marginBottom: 24, flexShrink: 0,
        boxShadow: "0 0 20px rgba(124,109,250,0.4)",
      }}>R</div>

      {NAV.map(({ id, icon: Icon, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            title={label}
            style={{
              width: 44, height: 44,
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: isActive ? "rgba(124,109,250,0.18)" : "transparent",
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
              position: "relative",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <Icon size={18} />
            {isActive && (
              <span style={{
                position: "absolute", right: -1, top: "50%",
                transform: "translateY(-50%)",
                width: 3, height: 24,
                background: "var(--accent)",
                borderRadius: "2px 0 0 2px",
              }} />
            )}
          </button>
        );
      })}
    </aside>
  );
}
