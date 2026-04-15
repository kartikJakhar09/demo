import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { postData } from "../hooks/useApi";
import { WEBHOOKS } from "../config";

const FIELDS = [
  { key: "name",        label: "Full Name",       type: "text",  required: true,  placeholder: "Jane Smith" },
  { key: "email",       label: "Email",            type: "email", required: true,  placeholder: "jane@company.com" },
  { key: "company",     label: "Company",          type: "text",  required: false, placeholder: "Acme Corp" },
  { key: "title",       label: "Job Title",        type: "text",  required: false, placeholder: "Head of Growth" },
  { key: "profile_url", label: "LinkedIn URL",     type: "url",   required: false, placeholder: "https://linkedin.com/in/jane" },
  { key: "pain_point",  label: "Known Pain Point", type: "text",  required: false, placeholder: "Describe their challenge..." },
];

export default function IngestLead() {
  const [form, setForm] = useState({});
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    const missing = FIELDS.filter(f => f.required && !form[f.key]);
    if (missing.length) {
      setStatus("error");
      setMessage(`Please fill: ${missing.map(f => f.label).join(", ")}`);
      return;
    }
    setStatus("loading");
    try {
      const res = await postData(WEBHOOKS.INGEST_LEAD, form);
      setStatus("success");
      setMessage(res?.message || "Lead ingested & queued for AI qualification.");
      setForm({});
    } catch (e) {
      setStatus("error");
      setMessage(e.message);
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: 600 }}>
      <div className="fade-up" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface2)",
        }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
            Ingest Lead Manually
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            POST → <code style={{ color: "var(--accent)" }}>/ingest-lead</code> · AI qualification + outreach triggered
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {FIELDS.map(field => (
              <div key={field.key} style={field.key === "pain_point" ? { gridColumn: "span 2" } : {}}>
                <label style={{
                  display: "block", marginBottom: 6,
                  fontSize: 11, color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.07em",
                }}>
                  {field.label}{field.required && <span style={{ color: "var(--accent2)", marginLeft: 2 }}>*</span>}
                </label>
                <input
                  type={field.type}
                  value={form[field.key] || ""}
                  onChange={e => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%", padding: "9px 12px",
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--text)", borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    outline: "none", transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            ))}
          </div>

          {/* Status */}
          {status === "success" && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "var(--radius-sm)", padding: "10px 14px",
              color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12,
            }}>
              <CheckCircle size={14} />
              {message}
            </div>
          )}
          {status === "error" && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "var(--radius-sm)", padding: "10px 14px",
              color: "var(--hot)", fontFamily: "var(--font-mono)", fontSize: 12,
            }}>
              <AlertCircle size={14} />
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: status === "loading" ? "var(--surface3)" : "var(--accent)",
              color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
              padding: "11px 24px", fontFamily: "var(--font-head)",
              fontWeight: 700, fontSize: 14, cursor: status === "loading" ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
              letterSpacing: "0.03em",
            }}
          >
            {status === "loading" ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Processing…</> : <><Send size={14} /> Ingest Lead</>}
          </button>
        </div>
      </div>

      {/* Flow explanation */}
      <div className="fade-up fade-up-2" style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>What happens next:</div>
        {[
          "Normalize lead data",
          "Dedup check in Airtable",
          "AI Lead Qualifier (GPT) → score + priority",
          "If score ≥ 60: generate outreach email + send via Gmail",
          "Store lead → stage: Contacted",
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "var(--surface2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, color: "var(--accent)", flexShrink: 0,
            }}>{i + 1}</span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
