import React, { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";
import { WEBHOOKS, BASE_URL } from "../config";

export default function Settings() {
  const [baseUrl, setBaseUrl] = useState(
    localStorage.getItem("rioo_base_url") || BASE_URL
  );
  const [saved, setSaved] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const handleSave = () => {
    localStorage.setItem("rioo_base_url", baseUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const endpoints = [
    { method: "GET",  label: "Dashboard Stats",  path: "/dashboard-stats",  desc: "Returns pipeline KPIs, stage counts, temperature breakdown" },
    { method: "GET",  label: "Dashboard Leads",  path: "/dashboard-leads",  desc: "Returns all leads with full field list" },
    { method: "POST", label: "Update Stage",      path: "/update-stage",     desc: "Body: { id, stage } — manually overrides lead stage in Airtable" },
    { method: "POST", label: "Ingest Lead",       path: "/ingest-lead",      desc: "Body: { name, email, company, title, profile_url, pain_point }" },
    { method: "POST", label: "Ingest Apify",      path: "/ingest-apify",     desc: "Body: { linkedin_url, max_leads } — triggers Apify LinkedIn scrape" },
  ];

  return (
    <div style={{ padding: "28px", maxWidth: 700 }}>
      <div className="fade-up" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 20,
      }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Configuration</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            Set your n8n webhook base URL. Saved to localStorage.
          </div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              n8n Webhook Base URL
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type={showUrl ? "text" : "password"}
                  value={baseUrl}
                  onChange={e => setBaseUrl(e.target.value)}
                  style={{
                    width: "100%", padding: "9px 40px 9px 12px",
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--text)", borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-mono)", fontSize: 12, outline: "none",
                  }}
                />
                <button onClick={() => setShowUrl(v => !v)} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
                }}>
                  {showUrl ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button onClick={handleSave} style={{
                background: saved ? "var(--green)" : "var(--accent)",
                color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
                padding: "0 16px", fontFamily: "var(--font-mono)", fontSize: 12,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                transition: "background 0.2s", whiteSpace: "nowrap",
              }}>
                <Save size={13} />
                {saved ? "Saved!" : "Save"}
              </button>
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
              Restart the app after changing. Or set REACT_APP_N8N_BASE_URL in .env
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint reference */}
      <div className="fade-up fade-up-2" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Webhook Reference</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {endpoints.map((ep, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "14px 24px",
              borderBottom: i < endpoints.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{
                background: ep.method === "GET" ? "rgba(34,197,94,0.15)" : "rgba(124,109,250,0.15)",
                color: ep.method === "GET" ? "var(--green)" : "var(--accent)",
                border: `1px solid ${ep.method === "GET" ? "rgba(34,197,94,0.3)" : "rgba(124,109,250,0.3)"}`,
                borderRadius: 4, padding: "2px 7px",
                fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600,
                flexShrink: 0, marginTop: 2,
              }}>{ep.method}</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontFamily: "var(--font-head)", fontWeight: 600, color: "var(--text)" }}>{ep.label}</span>
                  <code style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{ep.path}</code>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{ep.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
