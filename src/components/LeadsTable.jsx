import React, { useState, useMemo } from "react";
import { Search, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { useFetch } from "../hooks/useApi";
import { WEBHOOKS, STAGE_COLORS, TEMP_COLORS, STAGES } from "../config";

function StageBadge({ stage }) {
  const color = STAGE_COLORS[stage] || "#6b6b8a";
  return (
    <span style={{
      background: `${color}20`, color,
      border: `1px solid ${color}40`,
      borderRadius: 4, padding: "2px 8px",
      fontSize: 10, fontFamily: "var(--font-mono)",
      fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em",
    }}>{stage}</span>
  );
}

function TempDot({ temp }) {
  const color = TEMP_COLORS[temp?.toLowerCase()] || "var(--text-muted)";
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ fontSize: 11, color, fontFamily: "var(--font-mono)", textTransform: "capitalize" }}>{temp || "—"}</span>
    </span>
  );
}

function ScoreBar({ score }) {
  const val = Number(score) || 0;
  const color = val >= 80 ? "var(--green)" : val >= 60 ? "var(--warm)" : "var(--cold)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 4, background: "var(--surface3)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${val}%`, height: "100%", background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{val}</span>
    </div>
  );
}

const COLS = [
  { key: "name",     label: "Name",       sortable: true },
  { key: "company",  label: "Company",    sortable: true },
  { key: "score",    label: "Score",      sortable: true },
  { key: "stage",    label: "Stage",      sortable: true },
  { key: "temperature", label: "Temp",   sortable: true },
  { key: "follow_up_count", label: "Follow-ups", sortable: true },
  { key: "last_contacted", label: "Last Contact", sortable: true },
  { key: "profile_url", label: "LinkedIn", sortable: false },
];

export default function LeadsTable({ onRefreshRef }) {
  const { data, loading, error, refetch } = useFetch(WEBHOOKS.DASHBOARD_LEADS);
  React.useEffect(() => { if (onRefreshRef) onRefreshRef.current = refetch; }, [refetch, onRefreshRef]);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [tempFilter, setTempFilter] = useState("All");
  const [sort, setSort] = useState({ key: "score", dir: "desc" });
  const [expanded, setExpanded] = useState(null);

  const leads = data?.leads || [];

  const filtered = useMemo(() => {
    let arr = [...leads];
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(l =>
        (l.name || "").toLowerCase().includes(q) ||
        (l.company || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q)
      );
    }
    if (stageFilter !== "All") arr = arr.filter(l => l.stage === stageFilter);
    if (tempFilter !== "All") arr = arr.filter(l => (l.temperature || "").toLowerCase() === tempFilter.toLowerCase());

    arr.sort((a, b) => {
      let av = a[sort.key] ?? "";
      let bv = b[sort.key] ?? "";
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [leads, search, stageFilter, tempFilter, sort]);

  const toggleSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
  };

  if (loading) return <div style={{ padding: 48, display: "flex", justifyContent: "center" }}><span className="spinner" /></div>;
  if (error) return <div style={{ padding: 48, color: "var(--hot)", textAlign: "center", fontFamily: "var(--font-mono)" }}>Error: {error} <button onClick={refetch} style={{ marginLeft: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>Retry</button></div>;

  return (
    <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters bar */}
      <div className="fade-up" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 320 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            style={{
              width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)",
              borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", fontSize: 12,
              outline: "none",
            }}
          />
        </div>
        {/* Stage filter */}
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} style={selectStyle}>
          <option>All</option>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        {/* Temp filter */}
        <select value={tempFilter} onChange={e => setTempFilter(e.target.value)} style={selectStyle}>
          <option>All</option>
          <option>Hot</option><option>Warm</option><option>Cold</option>
        </select>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginLeft: "auto" }}>
          {filtered.length} / {leads.length} leads
        </span>
      </div>

      {/* Table */}
      <div className="fade-up fade-up-2" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {COLS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && toggleSort(col.key)}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      fontWeight: 600,
                      color: sort.key === col.key ? "var(--accent)" : "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      cursor: col.sortable ? "pointer" : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      background: "var(--surface2)",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {col.label}
                      {col.sortable && sort.key === col.key && (
                        sort.dir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={COLS.length} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  No leads found
                </td></tr>
              )}
              {filtered.map((lead, i) => (
                <React.Fragment key={lead.id || i}>
                  <tr
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                      background: expanded === i ? "var(--surface2)" : "transparent",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => { if (expanded !== i) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { if (expanded !== i) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: "var(--text)" }}>{lead.name || "—"}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{lead.email || ""}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 12, color: "var(--text)" }}>{lead.company || "—"}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{lead.title || ""}</div>
                    </td>
                    <td style={tdStyle}><ScoreBar score={lead.score} /></td>
                    <td style={tdStyle}><StageBadge stage={lead.stage || "New"} /></td>
                    <td style={tdStyle}><TempDot temp={lead.temperature} /></td>
                    <td style={tdStyle}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{lead.follow_up_count || 0}×</span></td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                        {lead.last_contacted ? new Date(lead.last_contacted).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {lead.profile_url ? (
                        <a href={lead.profile_url} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                          <ExternalLink size={12} />
                        </a>
                      ) : "—"}
                    </td>
                  </tr>
                  {/* Expanded row */}
                  {expanded === i && (
                    <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                      <td colSpan={COLS.length} style={{ padding: "14px 18px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                          <Field label="Pain Point" value={lead.pain_point} />
                          <Field label="AI Reasoning" value={lead.reasoning} />
                          <Field label="Email Subject Sent" value={lead.ai_email_subject} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
                          <Field label="Category" value={lead.category} />
                          <Field label="Priority" value={lead.priority} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>{value || "—"}</div>
    </div>
  );
}

const tdStyle = {
  padding: "10px 14px",
  verticalAlign: "middle",
};

const selectStyle = {
  background: "var(--surface)", border: "1px solid var(--border)",
  color: "var(--text)", borderRadius: "var(--radius-sm)",
  padding: "7px 10px", fontFamily: "var(--font-mono)", fontSize: 12,
  cursor: "pointer", outline: "none",
};
