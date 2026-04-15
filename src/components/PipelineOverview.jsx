import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { Users, TrendingUp, Flame, Star } from "lucide-react";
import { useFetch } from "../hooks/useApi";
import { WEBHOOKS, STAGE_COLORS, TEMP_COLORS } from "../config";
import StatCard from "./StatCard";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--surface2)", border: "1px solid var(--border-hi)",
        borderRadius: "var(--radius-sm)", padding: "10px 14px",
        fontFamily: "var(--font-mono)", fontSize: 12,
      }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
        <div style={{ color: "var(--text)", fontWeight: 600 }}>{payload[0].value} leads</div>
      </div>
    );
  }
  return null;
};

export default function PipelineOverview({ onRefreshRef }) {
  const { data, loading, error, refetch } = useFetch(WEBHOOKS.DASHBOARD_STATS);
  React.useEffect(() => { if (onRefreshRef) onRefreshRef.current = refetch; }, [refetch, onRefreshRef]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const stats = data || {};
  const pipeline = stats.pipeline || {};
  const temp = stats.temperature || {};

  const funnelData = Object.entries(pipeline).map(([stage, count]) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count,
    color: STAGE_COLORS[stage.charAt(0).toUpperCase() + stage.slice(1)] || "#6b6b8a",
  }));

  const tempData = [
    { name: "Hot",  value: temp.hot  || 0, color: TEMP_COLORS.hot },
    { name: "Warm", value: temp.warm || 0, color: TEMP_COLORS.warm },
    { name: "Cold", value: temp.cold || 0, color: TEMP_COLORS.cold },
  ].filter(d => d.value > 0);

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <StatCard delay={1} label="Total Leads" value={stats.total_leads || 0} icon={Users} accent="var(--accent)" sub="all time ingested" />
        <StatCard delay={2} label="Avg AI Score" value={`${stats.avg_score || 0}`} icon={Star} accent="var(--accent2)" sub="out of 100" />
        <StatCard delay={3} label="Conversion Rate" value={`${stats.conversion_rate || 0}%`} icon={TrendingUp} accent="var(--accent3)" sub="interested + booked + closed" />
        <StatCard delay={4} label="Hot Leads" value={temp.hot || 0} icon={Flame} accent="var(--hot)" sub="ready to convert" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        {/* Funnel bar chart */}
        <div className="fade-up fade-up-5" style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "20px 24px",
        }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, marginBottom: 20, color: "var(--text)" }}>
            Pipeline Funnel
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={funnelData} barCategoryGap="30%">
              <XAxis
                dataKey="stage"
                tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {funnelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature donut */}
        <div className="fade-up fade-up-6" style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "20px 24px",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, marginBottom: 20, color: "var(--text)" }}>
            Temperature
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={tempData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {tempData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                iconType="circle" iconSize={8}
                formatter={v => <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{v}</span>}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface2)", border: "1px solid var(--border-hi)",
                  borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Stage mini-list */}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(pipeline).map(([stage, count]) => {
              const stageName = stage.charAt(0).toUpperCase() + stage.slice(1);
              const color = STAGE_COLORS[stageName] || "#6b6b8a";
              const total = stats.total_leads || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={stage} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", flex: 1 }}>{stageName}</span>
                  <span style={{ fontSize: 11, color: "var(--text)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{count}</span>
                  <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton" style={{ height: 100, borderRadius: "var(--radius)" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div className="skeleton" style={{ height: 320, borderRadius: "var(--radius)" }} />
        <div className="skeleton" style={{ height: 320, borderRadius: "var(--radius)" }} />
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <div style={{ color: "var(--hot)", fontFamily: "var(--font-mono)", marginBottom: 16 }}>
        Failed to load stats: {error}
      </div>
      <button onClick={onRetry} style={{
        background: "var(--accent)", color: "#fff", border: "none",
        borderRadius: "var(--radius-sm)", padding: "8px 20px",
        fontFamily: "var(--font-mono)", cursor: "pointer",
      }}>Retry</button>
    </div>
  );
}
