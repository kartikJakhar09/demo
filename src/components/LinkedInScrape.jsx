import React, { useState } from "react";
import { Zap, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { postData } from "../hooks/useApi";
import { WEBHOOKS } from "../config";

const PRESETS = [
  { label: "SaaS Founders",       keyword: "saas founder" },
  { label: "Head of Growth",      keyword: "head of growth" },
  { label: "Startup CTOs",        keyword: "startup cto" },
  { label: "Marketing Directors", keyword: "marketing director b2b" },
];

export default function LinkedInScrape() {
  const [keyword, setKeyword] = useState("");
  const [maxLeads, setMaxLeads] = useState(50);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleScrape = async () => {
    if (!keyword.trim()) {
      setStatus("error"); setMessage("Please enter a keyword or select a preset."); return;
    }
    setStatus("loading");
    try {
      const res = await postData(WEBHOOKS.INGEST_APIFY, {
        keyword: keyword.trim(),
        max_leads: maxLeads,
      });
      setStatus("success");
      setMessage(res?.message || "Apify scrape triggered. Leads will be processed asynchronously.");
    } catch (e) {
      setStatus("error");
      setMessage(e.message);
    }
  };

  // Preview the LinkedIn URL that will be constructed by n8n
  const previewUrl = keyword.trim()
    ? `linkedin.com/search/results/people/?keywords=${encodeURIComponent(keyword.trim())}`
    : null;

  return (
    <div style={{ padding: "28px", maxWidth: 640 }}>
      <div className="fade-up" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface2)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, #0077b5, #00a0dc)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>in</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
              LinkedIn Scrape via Apify
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
              POST → <code style={{ color: "var(--accent)" }}>/ingest-apify</code> · triggers automated scrape + qualify
            </div>
          </div>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Presets */}
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Quick Presets
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => setKeyword(p.keyword)} style={{
                  background: keyword === p.keyword ? "rgba(124,109,250,0.2)" : "var(--surface2)",
                  border: `1px solid ${keyword === p.keyword ? "var(--accent)" : "var(--border)"}`,
                  color: keyword === p.keyword ? "var(--accent)" : "var(--text-muted)",
                  borderRadius: "var(--radius-sm)", padding: "6px 12px",
                  fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Input */}
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Search Keywords <span style={{ color: "var(--accent2)" }}>*</span>
            </label>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScrape()}
              placeholder="e.g. saas founder, startup cto, head of growth..."
              style={{
                width: "100%", padding: "9px 12px",
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--text)", borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-mono)", fontSize: 12, outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            {previewUrl && (
              <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "var(--accent)", opacity: 0.6 }}>→</span>
                <span style={{ opacity: 0.7, wordBreak: "break-all" }}>{previewUrl}</span>
              </div>
            )}
          </div>

          {/* Max leads */}
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Max Leads to Scrape: <span style={{ color: "var(--accent)" }}>{maxLeads}</span>
            </label>
            <input
              type="range" min={10} max={200} step={10}
              value={maxLeads} onChange={e => setMaxLeads(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
              <span>10</span><span>200</span>
            </div>
          </div>

          {/* Status */}
          {status === "success" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <CheckCircle size={14} />{message}
            </div>
          )}
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--hot)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <AlertCircle size={14} />{message}
            </div>
          )}

          <button
            onClick={handleScrape}
            disabled={status === "loading"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: status === "loading" ? "var(--surface3)" : "linear-gradient(135deg, var(--accent), var(--accent2))",
              color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
              padding: "12px 24px", fontFamily: "var(--font-head)", fontWeight: 700,
              fontSize: 14, cursor: status === "loading" ? "not-allowed" : "pointer",
              letterSpacing: "0.03em",
            }}
          >
            {status === "loading"
              ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Triggering…</>
              : <><Zap size={14} /> Launch Scrape</>}
          </button>
        </div>
      </div>

      {/* Pipeline steps */}
      <div className="fade-up fade-up-2" style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>Automated pipeline once triggered:</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {["Apify Scrape", "Normalize Data", "Dedup Check", "AI Qualify", "Generate Email", "Send via Gmail"].map((step, i) => (
            <React.Fragment key={step}>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "6px 10px",
                fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)",
              }}>{step}</div>
              {i < 5 && <ChevronRight size={12} style={{ color: "var(--text-dim)", flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
