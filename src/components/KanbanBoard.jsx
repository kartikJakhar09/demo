import React, { useState } from "react";
import { useFetch, postData } from "../hooks/useApi";
import { WEBHOOKS, STAGES, STAGE_COLORS } from "../config";

function LeadCard({ lead, onDragStart, isUpdating }) {
  const score = Number(lead.score) || 0;
  const scoreColor = score >= 80 ? "var(--green)" : score >= 60 ? "var(--warm)" : "var(--cold)";
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart(lead); }}
      style={{
        background: isUpdating ? "rgba(124,109,250,0.08)" : "var(--surface2)",
        border: `1px solid ${isUpdating ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--radius-sm)",
        padding: "12px 14px",
        cursor: isUpdating ? "wait" : "grab",
        transition: "border-color 0.15s, transform 0.15s, opacity 0.15s",
        userSelect: "none",
        opacity: isUpdating ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (!isUpdating) {
          e.currentTarget.style.borderColor = "var(--border-hi)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isUpdating ? "var(--accent)" : "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 12, color: "var(--text)", marginBottom: 4 }}>
        {lead.name || "Unknown"}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
        {lead.company || ""}{lead.title ? ` · ${lead.title}` : ""}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 36, height: 3, background: "var(--surface3)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${score}%`, height: "100%", background: scoreColor, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 10, color: scoreColor, fontFamily: "var(--font-mono)" }}>{score}</span>
        </div>
        {lead.temperature && (
          <span style={{
            fontSize: 9, fontFamily: "var(--font-mono)", textTransform: "uppercase",
            color: lead.temperature === "hot" ? "var(--hot)" : lead.temperature === "warm" ? "var(--warm)" : "var(--cold)",
            letterSpacing: "0.06em",
          }}>{lead.temperature}</span>
        )}
      </div>
    </div>
  );
}

function Column({ stage, leads, onDrop, onDragOver, updatingId, onDragStart }) {
  const color = STAGE_COLORS[stage] || "#6b6b8a";
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true); onDragOver(); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(stage); }}
      style={{
        minWidth: 200,
        maxWidth: 240,
        flex: "0 0 220px",
        background: over ? `${color}12` : "var(--surface)",
        border: `1px solid ${over ? color : "var(--border)"}`,
        borderRadius: "var(--radius)",
        padding: "14px 12px",
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxHeight: "calc(100vh - 180px)",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{stage}</span>
        </div>
        <span style={{
          background: `${color}20`, color,
          fontSize: 11, fontFamily: "var(--font-mono)",
          padding: "1px 7px", borderRadius: 99,
        }}>{leads.length}</span>
      </div>
      {leads.map((lead, i) => (
        <LeadCard
          key={lead.id || i}
          lead={lead}
          onDragStart={onDragStart}
          isUpdating={updatingId === lead.id}
        />
      ))}
      {leads.length === 0 && (
        <div style={{
          textAlign: "center", padding: "20px 0",
          color: over ? color : "var(--text-dim)",
          fontSize: 11, fontFamily: "var(--font-mono)",
          border: over ? `1px dashed ${color}` : "1px dashed transparent",
          borderRadius: "var(--radius-sm)",
          transition: "all 0.15s",
        }}>
          {over ? "↓ Drop here" : "Drop here"}
        </div>
      )}
    </div>
  );
}

export default function KanbanBoard({ onRefreshRef }) {
  const { data, loading, error, refetch } = useFetch(WEBHOOKS.DASHBOARD_LEADS);
  React.useEffect(() => { if (onRefreshRef) onRefreshRef.current = refetch; }, [refetch, onRefreshRef]);

  const [dragging, setDragging] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  const leads = data?.leads || [];

  // Optimistic UI: track local stage overrides
  const [localStages, setLocalStages] = useState({});

  const getStage = (lead) => localStages[lead.id] || lead.stage || "New";

  const grouped = STAGES.reduce((acc, s) => {
    acc[s] = leads.filter(l => getStage(l) === s);
    return acc;
  }, {});

  const handleDragStart = (lead) => {
    setDragging(lead);
  };

  const handleDrop = async (targetStage) => {
    if (!dragging) return;
    if (getStage(dragging) === targetStage) { setDragging(null); return; }

    const leadId = dragging.id;
    const leadName = dragging.name;

    // Optimistic update
    setLocalStages(prev => ({ ...prev, [leadId]: targetStage }));
    setUpdating(leadId);
    setDragging(null);

    try {
      // n8n Manual Stage Override node expects: record_id, stage, status
      await postData(WEBHOOKS.UPDATE_STAGE, {
        record_id: leadId,
        stage: targetStage,
        status: targetStage,
      });
      showToast(`✓ ${leadName} → ${targetStage}`);
      refetch();
    } catch (e) {
      // Rollback optimistic update on failure
      setLocalStages(prev => {
        const next = { ...prev };
        delete next[leadId];
        return next;
      });
      showToast(`✗ Failed: ${e.message}`, true);
    } finally {
      setUpdating(null);
    }
  };

  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div style={{ padding: 48, display: "flex", justifyContent: "center" }}><span className="spinner" /></div>;
  if (error) return <div style={{ padding: 48, color: "var(--hot)", textAlign: "center", fontFamily: "var(--font-mono)" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px 28px", position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          background: toast.err ? "var(--hot)" : "var(--green)",
          color: "#fff", borderRadius: "var(--radius-sm)",
          padding: "10px 18px", fontFamily: "var(--font-mono)", fontSize: 12,
          boxShadow: "var(--shadow-lg)",
          animation: "fadeUp 0.3s ease",
        }}>{toast.msg}</div>
      )}

      <div style={{
        display: "flex", gap: 12,
        overflowX: "auto", paddingBottom: 16,
      }}>
        {STAGES.map(stage => (
          <Column
            key={stage}
            stage={stage}
            leads={grouped[stage] || []}
            onDragOver={() => {}}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            updatingId={updating}
          />
        ))}
      </div>

      {/* Override each LeadCard's onDragStart now that we have the handler in scope */}
      <style>{`
        [draggable="true"] { -webkit-user-drag: element; }
      `}</style>

      <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
        Drag & drop cards to update stage via <code style={{ color: "var(--accent)" }}>POST /update-stage</code>
        {updating && <span style={{ marginLeft: 12 }}><span className="spinner" style={{ width: 12, height: 12, borderWidth: 1 }} /></span>}
      </div>
    </div>
  );
}
