import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";

/* ─── animated counter ─── */
function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function Num({ v, pre = "", suf = "", dec = 0 }: any) {
  const n = useCountUp(parseFloat(v) || 0);
  const display = dec > 0 ? (parseFloat(v) || 0).toFixed(dec) : n;
  return <>{pre}{display}{suf}</>;
}

/* ─── sparkline bar ─── */
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ background: "#e2e8f033", borderRadius: 4, height: 6, flex: 1 }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, background: color, height: 6, borderRadius: 4, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

/* ─── custom tooltip ─── */
function ChartTip({ active, payload, label, card, border, text, muted }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 32px #0002", fontSize: 12 }}>
      <div style={{ color: muted, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: text }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── risk badge ─── */
function Risk({ s }: { s: number }) {
  const [c, bg, label] = s >= 60 ? ["#ef4444", "#fef2f2", "HIGH"] : s >= 35 ? ["#f59e0b", "#fffbeb", "MED"] : ["#22c55e", "#f0fdf4", "LOW"];
  return (
    <span style={{ background: bg, color: c, padding: "3px 10px", borderRadius: 20, fontWeight: 800, fontSize: 11, letterSpacing: "0.05em", border: `1px solid ${c}33` }}>
      {label} {s}
    </span>
  );
}

/* ─── section header ─── */
function SH({ title, sub, icon }: { title: string; sub?: string; icon: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h2>
      </div>
      {sub && <p style={{ margin: "4px 0 0 30px", fontSize: 13, color: "#64748b" }}>{sub}</p>}
    </div>
  );
}

const GRAD = "linear-gradient(135deg,#6366f1,#8b5cf6)";
const GRAD2 = "linear-gradient(135deg,#0ea5e9,#6366f1)";

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortK, setSortK] = useState("churnScore");
  const [sortD, setSortD] = useState<"asc" | "desc">("desc");
  const [filterChurn, setFilterChurn] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [form, setForm] = useState({ tenure: 12, monthlyCharges: 65, totalCharges: 780, seniorCitizen: 0, contract: 0 });
  const [pred, setPred] = useState<any>(null);
  const [predLoad, setPredLoad] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [now] = useState(new Date());
  const PS = 10;

  const q = (url: string, key: string[]) => useQuery({ queryKey: key, queryFn: () => fetch(url).then(r => r.json()) });
  const { data: S } = q("/api/churn/summary", ["s"]);
  const { data: BC } = q("/api/churn/by-contract", ["bc"]);
  const { data: BI } = q("/api/churn/by-internet", ["bi"]);
  const { data: BP } = q("/api/churn/by-payment", ["bp"]);
  const { data: TD } = q("/api/churn/tenure-distribution", ["td"]);
  const { data: CD } = q("/api/churn/monthly-charges", ["cd"]);
  const { data: CX } = q("/api/churn/customers", ["cx"]);

  const bg = dark ? "#060d1a" : "#f0f4ff";
  const card = dark ? "#0d1526" : "#ffffff";
  const card2 = dark ? "#111d30" : "#f8faff";
  const T = dark ? "#e8edf8" : "#0f172a";
  const M = dark ? "#7a8aaa" : "#64748b";
  const B = dark ? "#1e2d45" : "#e2e8f0";
  const IB = dark ? "#060d1a" : "#f8fafc";

  /* export */
  const exportCSV = () => {
    if (!CX) return;
    const h = ["Customer ID", "Contract", "Tenure", "Monthly", "Total", "Internet", "Churn", "Risk"];
    const rows = CX.map((c: any) => [c.customerId, c.contract, c.tenure, c.monthlyCharges, c.totalCharges, c.internetService, c.churn, c.churnScore]);
    const csv = [h, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `churnguard_export_${now.toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  /* sort */
  const sort = (k: string) => { if (sortK === k) setSortD(d => d === "asc" ? "desc" : "asc"); else { setSortK(k); setSortD("desc"); } setPage(0); };

  /* filter + sort customers */
  const filtered = (CX ?? []).filter((c: any) => {
    const s = (c.customerId + c.contract + c.internetService).toLowerCase().includes(search.toLowerCase());
    const ch = filterChurn === "all" || (filterChurn === "yes" ? c.churn === "Yes" : c.churn === "No");
    const rk = filterRisk === "all" || (filterRisk === "high" ? c.churnScore >= 60 : filterRisk === "med" ? c.churnScore >= 35 && c.churnScore < 60 : c.churnScore < 35);
    return s && ch && rk;
  }).sort((a: any, b: any) => sortD === "asc" ? (a[sortK] > b[sortK] ? 1 : -1) : (a[sortK] < b[sortK] ? 1 : -1));

  const paged = filtered.slice(page * PS, (page + 1) * PS);
  const totalPg = Math.ceil(filtered.length / PS);

  /* predict */
  const predict = async () => {
    setPredLoad(true);
    const r = await fetch("/api/churn/predict", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setPred(await r.json());
    setPredLoad(false);
  };

/* AI */
  const getAI = async () => {
    setAiLoad(true); setAiText("");
    try {
      const r = await fetch("/api/churn/ai-advisor", { method: "POST" });
      const d = await r.json();
      setAiText(d.text || "Unable to generate.");
    } catch { setAiText("AI unavailable. Check connection."); }
    setAiLoad(false);
  };
  /* derived */
  const highRisk = CX?.filter((c: any) => c.churnScore >= 60).length ?? 0;
  const medRisk = CX?.filter((c: any) => c.churnScore >= 35 && c.churnScore < 60).length ?? 0;
  const lowRisk = CX?.filter((c: any) => c.churnScore < 35).length ?? 0;
  const pieD = S ? [{ name: "Churned", value: S.churnedCustomers }, { name: "Retained", value: S.retainedCustomers }] : [];
  const PIE = ["#8b5cf6", "#3b82f6"];

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "charts", label: "Analytics", icon: "📈" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "predictor", label: "Risk Engine", icon: "🔮" },
    { id: "ai", label: "AI Advisor", icon: "🤖" },
  ];

  const C = (d: any) => <ChartTip {...d} card={card} border={B} text={T} muted={M} />;

  const refreshStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " · " +
    now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ background: bg, minHeight: "100vh", color: T, fontFamily: "'Inter',system-ui,sans-serif", fontSize: 14 }}>

      {/* ── TOP NAV ── */}
      <div style={{ background: dark ? "rgba(13,21,38,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${B}`, padding: "0 32px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 14px #6366f155" }}>🛡️</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 17, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>ChurnGuard</div>
              <div style={{ fontSize: 10, color: M, marginTop: -2, letterSpacing: "0.08em", textTransform: "uppercase" }}>Enterprise Analytics</div>
            </div>
            <div style={{ width: 1, height: 30, background: B, margin: "0 8px" }} />
            <div style={{ display: "flex", gap: 2 }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: tab === t.id ? (dark ? "#1e2d45" : "#eef2ff") : "transparent", color: tab === t.id ? "#6366f1" : M, cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 11, color: M, textAlign: "right" }}>
              <div style={{ color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />Live</div>
              <div>{refreshStr}</div>
            </div>
            <button onClick={exportCSV} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${B}`, background: card, color: T, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>⬇ Export</button>
            <button onClick={() => setDark(!dark)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${B}`, background: card, color: T, cursor: "pointer", fontSize: 14 }}>{dark ? "☀️" : "🌙"}</button>
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1600, margin: "0 auto" }}>

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {tab === "overview" && (
          <>
            {/* Alert bar */}
            {S?.churnRate > 25 && (
              <div style={{ background: "linear-gradient(90deg,#fef2f2,#fff7ed)", border: "1px solid #fca5a5", borderLeft: "4px solid #ef4444", borderRadius: 10, padding: "12px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18 }}>🚨</span>
                <div>
                  <span style={{ fontWeight: 700, color: "#ef4444" }}>Critical Churn Alert</span>
                  <span style={{ color: "#7f1d1d", fontSize: 13, marginLeft: 8 }}>Churn rate at {S?.churnRate?.toFixed(1)}% — exceeds the 25% industry warning threshold. Immediate retention action recommended.</span>
                </div>
              </div>
            )}

            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Customers", val: S?.totalCustomers ?? 0, pre: "", suf: "", dec: 0, icon: "👥", color: "#3b82f6", sub: `${S?.retainedCustomers ?? 0} retained`, subC: "#22c55e" },
                { label: "Churn Rate", val: S?.churnRate ?? 0, pre: "", suf: "%", dec: 1, icon: "📉", color: "#ef4444", sub: `${S?.churnedCustomers ?? 0} customers lost`, subC: "#ef4444" },
                { label: "Avg Tenure (Retained)", val: S?.avgTenureRetained ?? 0, pre: "", suf: " mo", dec: 1, icon: "📅", color: "#22c55e", sub: `${(S?.avgTenureChurned ?? 0).toFixed(1)} mo avg churned`, subC: "#f59e0b" },
                { label: "Avg Monthly Charges", val: S?.avgMonthlyChargesRetained ?? 0, pre: "$", suf: "", dec: 0, icon: "💳", color: "#f59e0b", sub: `$${(S?.avgMonthlyChargesChurned ?? 0).toFixed(0)} avg churned`, subC: "#ef4444" },
                { label: "Senior Churn Rate", val: S?.seniorChurnRate ?? 0, pre: "", suf: "%", dec: 1, icon: "👴", color: "#8b5cf6", sub: "Higher than average", subC: "#8b5cf6" },
              ].map(c => (
                <div key={c.label} style={{ background: card, borderRadius: 16, padding: "20px 22px", border: `1px solid ${B}`, position: "relative", overflow: "hidden", boxShadow: `0 1px 3px ${B}` }}>
                  <div style={{ position: "absolute", top: -10, right: -10, fontSize: 52, opacity: 0.06 }}>{c.icon}</div>
                  <div style={{ fontSize: 11, color: M, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{c.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: c.color, lineHeight: 1 }}>
                    <Num v={c.val} pre={c.pre} suf={c.suf} dec={c.dec} />
                  </div>
                  <div style={{ fontSize: 11, color: c.subC, marginTop: 8, fontWeight: 500 }}>{c.sub}</div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${c.color}88,${c.color}11)` }} />
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
              {/* Area chart */}
              <div style={{ background: card, borderRadius: 16, padding: 22, border: `1px solid ${B}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Tenure vs Churn Pattern</div>
                    <div style={{ color: M, fontSize: 12 }}>Churn & retention across tenure buckets</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={TD?.map((d: any) => ({ name: d.bucket, Retained: d.retained, Churned: d.churned }))}>
                    <defs>
                      <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={B} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                    <Tooltip content={<C />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="Retained" stroke="#3b82f6" strokeWidth={2} fill="url(#gr)" />
                    <Area type="monotone" dataKey="Churned" stroke="#8b5cf6" strokeWidth={2} fill="url(#gc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie */}
              <div style={{ background: card, borderRadius: 16, padding: 22, border: `1px solid ${B}` }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Customer Split</div>
                <div style={{ color: M, fontSize: 12, marginBottom: 12 }}>Churned vs Retained</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieD} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                      {pieD.map((_: any, i: number) => <Cell key={i} fill={PIE[i]} />)}
                    </Pie>
                    <Tooltip content={<C />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                  {pieD.map((d: any, i: number) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE[i] }} />
                      <span style={{ color: M }}>{d.name}:</span>
                      <span style={{ fontWeight: 700 }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk dist */}
              <div style={{ background: card, borderRadius: 16, padding: 22, border: `1px solid ${B}` }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Risk Distribution</div>
                <div style={{ color: M, fontSize: 12, marginBottom: 20 }}>Customer risk segments</div>
                {[
                  { label: "High Risk", val: highRisk, color: "#ef4444", pct: CX ? (highRisk / CX.length) * 100 : 0 },
                  { label: "Medium Risk", val: medRisk, color: "#f59e0b", pct: CX ? (medRisk / CX.length) * 100 : 0 },
                  { label: "Low Risk", val: lowRisk, color: "#22c55e", pct: CX ? (lowRisk / CX.length) * 100 : 0 },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: M }}>{r.label}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: r.color, fontWeight: 700 }}>{r.val}</span>
                        <span style={{ fontSize: 10, color: M }}>{r.pct.toFixed(0)}%</span>
                      </div>
                    </div>
                    <MiniBar pct={r.pct} color={r.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3 — scorecards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {[
                { title: "Top Churn Driver", val: "Month-to-month", sub: `${BC?.find((d: any) => d.group === "Month-to-month") ? ((BC.find((d: any) => d.group === "Month-to-month").churned / BC.find((d: any) => d.group === "Month-to-month").total) * 100).toFixed(0) : "~55"}% churn rate`, icon: "📋", color: "#ef4444" },
                { title: "Highest Risk Service", val: "Fiber Optic", sub: `${BI?.find((d: any) => d.group === "Fiber optic") ? ((BI.find((d: any) => d.group === "Fiber optic").churned / BI.find((d: any) => d.group === "Fiber optic").total) * 100).toFixed(0) : "~40"}% churn rate`, icon: "📡", color: "#f59e0b" },
                { title: "Revenue at Risk", val: `$${Math.round((S?.churnedCustomers ?? 0) * (S?.avgMonthlyChargesChurned ?? 0)).toLocaleString()}`, sub: "Monthly recurring revenue lost", icon: "💸", color: "#8b5cf6" },
                { title: "Retention Score", val: `${(100 - (S?.churnRate ?? 0)).toFixed(1)}%`, sub: "Overall customer retention rate", icon: "🏆", color: "#22c55e" },
              ].map(s => (
                <div key={s.title} style={{ background: card, borderRadius: 16, padding: 20, border: `1px solid ${B}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: M, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: M, marginTop: 2 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════ ANALYTICS ═══════════════ */}
        {tab === "charts" && (
          <>
            <SH title="Analytics Deep-Dive" sub="Full breakdown of churn patterns across all dimensions" icon="📈" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { title: "By Contract Type", data: BC?.map((d: any) => ({ name: d.group, Retained: d.retained, Churned: d.churned })) },
                { title: "By Internet Service", data: BI?.map((d: any) => ({ name: d.group, Retained: d.retained, Churned: d.churned })) },
                { title: "By Payment Method", data: BP?.map((d: any) => ({ name: d.group?.split(" ")[0], Retained: d.retained, Churned: d.churned })) },
              ].map(ch => (
                <div key={ch.title} style={{ background: card, borderRadius: 16, padding: 20, border: `1px solid ${B}` }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{ch.title}</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={ch.data} barGap={3} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke={B} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                      <Tooltip content={<C />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Retained" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Churned" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: card, borderRadius: 16, padding: 20, border: `1px solid ${B}` }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Tenure Distribution (Stacked)</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={TD?.map((d: any) => ({ name: d.bucket, Retained: d.retained, Churned: d.churned }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={B} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                    <Tooltip content={<C />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Retained" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="Churned" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: card, borderRadius: 16, padding: 20, border: `1px solid ${B}` }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Monthly Charges Distribution</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={CD?.buckets?.map((d: any) => ({ name: d.range, Retained: d.retained, Churned: d.churned }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={B} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: M }} axisLine={false} tickLine={false} />
                    <Tooltip content={<C />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Retained" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="Churned" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Churn rate bars */}
            <div style={{ background: card, borderRadius: 16, padding: 22, border: `1px solid ${B}` }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Churn Rate % by Contract Type</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {BC?.map((d: any) => {
                  const rate = ((d.churned / d.total) * 100);
                  return (
                    <div key={d.group} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 160, fontSize: 13, color: M, flexShrink: 0 }}>{d.group}</div>
                      <div style={{ flex: 1, background: B, borderRadius: 6, height: 24, position: "relative", overflow: "hidden" }}>
                        <div style={{ width: `${rate}%`, background: rate > 40 ? "linear-gradient(90deg,#f59e0b,#ef4444)" : rate > 20 ? "linear-gradient(90deg,#3b82f6,#8b5cf6)" : "linear-gradient(90deg,#22c55e,#16a34a)", height: "100%", borderRadius: 6, transition: "width 1.2s ease", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                          <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>{rate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div style={{ width: 60, fontSize: 12, color: M, textAlign: "right" }}>{d.churned}/{d.total}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ CUSTOMERS ═══════════════ */}
        {tab === "customers" && (
          <>
            <SH title="Customer Registry" sub={`${filtered.length} customers · sortable, filterable, exportable`} icon="👥" />
            <div style={{ background: card, borderRadius: 16, padding: 22, border: `1px solid ${B}` }}>
              {/* Filters */}
              <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                <input placeholder="🔍 Search ID, contract, service..." value={search}
                  onChange={e => { setSearch(e.target.value); setPage(0); }}
                  style={{ flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: `1px solid ${B}`, background: IB, color: T, fontSize: 13 }} />
                <select value={filterChurn} onChange={e => { setFilterChurn(e.target.value); setPage(0); }}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${B}`, background: IB, color: T, fontSize: 13 }}>
                  <option value="all">All Customers</option>
                  <option value="yes">Churned</option>
                  <option value="no">Retained</option>
                </select>
                <select value={filterRisk} onChange={e => { setFilterRisk(e.target.value); setPage(0); }}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${B}`, background: IB, color: T, fontSize: 13 }}>
                  <option value="all">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="med">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
                <button onClick={exportCSV} style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${B}`, background: IB, color: T, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>⬇ CSV</button>
              </div>

              {/* Summary pills */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Showing", val: filtered.length, color: "#3b82f6" },
                  { label: "High Risk", val: filtered.filter((c: any) => c.churnScore >= 60).length, color: "#ef4444" },
                  { label: "Churned", val: filtered.filter((c: any) => c.churn === "Yes").length, color: "#8b5cf6" },
                ].map(p => (
                  <div key={p.label} style={{ background: p.color + "15", border: `1px solid ${p.color}33`, borderRadius: 8, padding: "4px 12px", fontSize: 12 }}>
                    <span style={{ color: M }}>{p.label}: </span><span style={{ fontWeight: 700, color: p.color }}>{p.val}</span>
                  </div>
                ))}
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${B}` }}>
                    {[
                      { k: "customerId", l: "Customer ID" }, { k: "contract", l: "Contract" },
                      { k: "tenure", l: "Tenure" }, { k: "monthlyCharges", l: "Monthly $" },
                      { k: "totalCharges", l: "Total $" }, { k: "internetService", l: "Internet" },
                      { k: "churnScore", l: "Risk Score" }, { k: "churn", l: "Status" },
                    ].map(h => (
                      <th key={h.k} onClick={() => sort(h.k)}
                        style={{ padding: "10px 12px", textAlign: "left", color: M, fontWeight: 600, fontSize: 11, cursor: "pointer", userSelect: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {h.l} {sortK === h.k ? (sortD === "asc" ? "↑" : "↓") : <span style={{ opacity: 0.3 }}>↕</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((c: any) => (
                    <tr key={c.customerId}
                      style={{ borderBottom: `1px solid ${B}`, transition: "background 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = dark ? "#1e2d4566" : "#f8faff")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "11px 12px", color: "#6366f1", fontWeight: 700, fontFamily: "monospace" }}>{c.customerId}</td>
                      <td style={{ padding: "11px 12px" }}>{c.contract}</td>
                      <td style={{ padding: "11px 12px" }}><span style={{ background: c.tenure <= 12 ? "#fef2f2" : "#f0fdf4", color: c.tenure <= 12 ? "#ef4444" : "#22c55e", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{c.tenure} mo</span></td>
                      <td style={{ padding: "11px 12px", fontWeight: 600 }}>${c.monthlyCharges}</td>
                      <td style={{ padding: "11px 12px", color: M }}>${c.totalCharges}</td>
                      <td style={{ padding: "11px 12px" }}>{c.internetService}</td>
                      <td style={{ padding: "11px 12px" }}><Risk s={c.churnScore} /></td>
                      <td style={{ padding: "11px 12px" }}>
                        <span style={{ background: c.churn === "Yes" ? "#fef2f2" : "#f0fdf4", color: c.churn === "Yes" ? "#ef4444" : "#22c55e", padding: "4px 12px", borderRadius: 20, fontWeight: 700, fontSize: 12 }}>
                          {c.churn === "Yes" ? "Churned" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                <span style={{ fontSize: 12, color: M }}>Page {page + 1} of {totalPg} · {filtered.length} records</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ l: "«", a: () => setPage(0) }, { l: "‹", a: () => setPage(p => Math.max(0, p - 1)) }, { l: "›", a: () => setPage(p => Math.min(totalPg - 1, p + 1)) }, { l: "»", a: () => setPage(totalPg - 1) }].map((b, i) => (
                    <button key={i} onClick={b.a} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${B}`, background: card, color: T, cursor: "pointer", fontSize: 13 }}>{b.l}</button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ PREDICTOR ═══════════════ */}
        {tab === "predictor" && (
          <>
            <SH title="Churn Risk Engine" sub="ML-powered real-time churn probability prediction" icon="🔮" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Input */}
              <div style={{ background: card, borderRadius: 16, padding: 28, border: `1px solid ${B}` }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Customer Profile</div>
                <div style={{ color: M, fontSize: 13, marginBottom: 24 }}>Enter customer attributes to predict churn risk</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {[
                    { l: "Tenure (months)", k: "tenure" },
                    { l: "Monthly Charges ($)", k: "monthlyCharges" },
                    { l: "Total Charges ($)", k: "totalCharges" },
                  ].map(f => (
                    <div key={f.k}>
                      <label style={{ fontSize: 11, color: M, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{f.l}</label>
                      <input type="number" value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: +e.target.value })}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${B}`, background: IB, color: T, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 11, color: M, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Senior Citizen</label>
                    <select value={form.seniorCitizen} onChange={e => setForm({ ...form, seniorCitizen: +e.target.value })}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${B}`, background: IB, color: T, fontSize: 14, boxSizing: "border-box" }}>
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={{ fontSize: 11, color: M, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Contract Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[{ l: "Month-to-month", v: 0, risk: "High" }, { l: "One year", v: 1, risk: "Med" }, { l: "Two year", v: 2, risk: "Low" }].map(o => (
                      <button key={o.v} onClick={() => setForm({ ...form, contract: o.v })}
                        style={{ padding: "12px 8px", borderRadius: 10, border: `2px solid ${form.contract === o.v ? "#6366f1" : B}`, background: form.contract === o.v ? (dark ? "#1e1b4b" : "#eef2ff") : IB, color: form.contract === o.v ? "#6366f1" : T, cursor: "pointer", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
                        <div>{o.l}</div>
                        <div style={{ fontSize: 10, marginTop: 2, color: o.v === 0 ? "#ef4444" : o.v === 1 ? "#f59e0b" : "#22c55e", fontWeight: 600 }}>{o.risk} risk</div>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={predict} disabled={predLoad}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, background: predLoad ? M : GRAD, color: "white", border: "none", fontWeight: 800, cursor: predLoad ? "not-allowed" : "pointer", fontSize: 15, boxShadow: predLoad ? "none" : "0 4px 20px #6366f155", letterSpacing: "0.02em" }}>
                  {predLoad ? "⏳ Analyzing..." : "🔮 Calculate Churn Risk"}
                </button>
              </div>

              {/* Result */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {pred ? (
                  <>
                    <div style={{ background: card, borderRadius: 16, padding: 28, border: `2px solid ${pred.prediction === 1 ? "#ef4444" : "#22c55e"}`, boxShadow: `0 0 40px ${pred.prediction === 1 ? "#ef444420" : "#22c55e20"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div style={{ fontWeight: 800, fontSize: 17 }}>Risk Assessment</div>
                        <div style={{ background: pred.prediction === 1 ? "#fef2f2" : "#f0fdf4", color: pred.prediction === 1 ? "#ef4444" : "#22c55e", padding: "8px 18px", borderRadius: 24, fontWeight: 900, fontSize: 13, border: `1px solid ${pred.prediction === 1 ? "#fca5a5" : "#86efac"}`, letterSpacing: "0.05em" }}>
                          {pred.prediction === 1 ? "⚠ HIGH RISK" : "✓ LOW RISK"}
                        </div>
                      </div>
                      <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, background: pred.prediction === 1 ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "linear-gradient(135deg,#22c55e,#16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {pred.churnProbability}%
                        </div>
                        <div style={{ color: M, fontSize: 14, marginTop: 6 }}>Churn Probability Score</div>
                      </div>
                      <div style={{ background: dark ? "#1e2d45" : "#f1f5f9", borderRadius: 10, height: 14, marginBottom: 20, overflow: "hidden" }}>
                        <div style={{ width: `${pred.churnProbability}%`, height: "100%", background: pred.prediction === 1 ? "linear-gradient(90deg,#f59e0b,#ef4444)" : "linear-gradient(90deg,#22c55e,#16a34a)", borderRadius: 10, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
                      </div>
                      <div style={{ textAlign: "center", color: M, fontSize: 13 }}>Verdict: <strong style={{ color: T, fontSize: 15 }}>{pred.label}</strong></div>
                    </div>
                    <div style={{ background: card, borderRadius: 16, padding: 22, border: `1px solid ${B}` }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Contributing Risk Factors</div>
                      {[
                        { l: "Contract Type", risk: form.contract === 0 ? 85 : form.contract === 1 ? 40 : 10, label: form.contract === 0 ? "Month-to-month" : form.contract === 1 ? "One year" : "Two year" },
                        { l: "Customer Tenure", risk: form.tenure <= 12 ? 80 : form.tenure <= 24 ? 50 : 20, label: `${form.tenure} months` },
                        { l: "Monthly Charges", risk: form.monthlyCharges > 80 ? 70 : form.monthlyCharges > 50 ? 45 : 25, label: `$${form.monthlyCharges}` },
                        { l: "Senior Status", risk: form.seniorCitizen ? 65 : 30, label: form.seniorCitizen ? "Senior" : "Non-senior" },
                      ].map(f => (
                        <div key={f.l} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: M }}>{f.l} <span style={{ color: T, fontWeight: 600 }}>({f.label})</span></span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: f.risk > 60 ? "#ef4444" : f.risk > 35 ? "#f59e0b" : "#22c55e" }}>{f.risk}%</span>
                          </div>
                          <MiniBar pct={f.risk} color={f.risk > 60 ? "#ef4444" : f.risk > 35 ? "#f59e0b" : "#22c55e"} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ background: card, borderRadius: 16, padding: 48, border: `1px solid ${B}`, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <div style={{ fontSize: 56 }}>🔮</div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Awaiting Input</div>
                    <div style={{ color: M, fontSize: 13, maxWidth: 260 }}>Configure the customer profile on the left and click Calculate to see the risk assessment.</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ AI ADVISOR ═══════════════ */}
        {tab === "ai" && (
          <>
            <SH title="AI Business Advisor" sub="Claude AI analyzes your live data and generates executive-grade recommendations" icon="🤖" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: card, borderRadius: 16, padding: 24, border: `1px solid ${B}` }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Data Context</div>
                  <div style={{ color: M, fontSize: 13, marginBottom: 20 }}>The following live metrics will be sent to Claude AI for analysis.</div>
                  {S && [
                    { l: "Total Customers", v: S.totalCustomers, c: "#3b82f6" },
                    { l: "Churn Rate", v: S.churnRate?.toFixed(1) + "%", c: "#ef4444" },
                    { l: "Senior Churn Rate", v: S.seniorChurnRate?.toFixed(1) + "%", c: "#8b5cf6" },
                    { l: "Avg Monthly (Churned)", v: "$" + S.avgMonthlyChargesChurned?.toFixed(0), c: "#f59e0b" },
                    { l: "Avg Tenure (Retained)", v: S.avgTenureRetained?.toFixed(1) + " mo", c: "#22c55e" },
                  ].map(r => (
                    <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${B}` }}>
                      <span style={{ fontSize: 13, color: M }}>{r.l}</span>
                      <span style={{ fontWeight: 700, color: r.c, fontSize: 13 }}>{r.v}</span>
                    </div>
                  ))}
                  <button onClick={getAI} disabled={aiLoad || !S}
                    style={{ width: "100%", marginTop: 20, padding: "14px", borderRadius: 12, background: aiLoad ? M : GRAD, color: "white", border: "none", fontWeight: 800, cursor: aiLoad ? "not-allowed" : "pointer", fontSize: 14, boxShadow: aiLoad ? "none" : "0 4px 20px #6366f155" }}>
                    {aiLoad ? "⏳ Claude is analyzing..." : "✨ Generate Executive Report"}
                  </button>
                </div>

                <div style={{ background: card, borderRadius: 16, padding: 22, border: `1px solid ${B}` }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📌 Key Findings</div>
                  {[
                    { icon: "🔴", t: "Month-to-month = highest risk", s: "Over 50% of these customers churn" },
                    { icon: "📡", t: "Fiber optic churn is elevated", s: "Pricing vs value perception issue" },
                    { icon: "👴", t: "Senior segment needs attention", s: `${S?.seniorChurnRate?.toFixed(0)}% churn — needs dedicated plans` },
                    { icon: "⏱", t: "First 12 months are critical", s: "Highest churn window — needs onboarding focus" },
                    { icon: "💸", t: "Revenue at risk is significant", s: `$${Math.round((S?.churnedCustomers ?? 0) * (S?.avgMonthlyChargesChurned ?? 0)).toLocaleString()}/mo lost` },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${B}` }}>
                      <span>{f.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.t}</div>
                        <div style={{ fontSize: 11, color: M, marginTop: 2 }}>{f.s}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: card, borderRadius: 16, padding: 28, border: `1px solid ${B}`, minHeight: 500 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>AI Executive Report</div>
                    <div style={{ color: M, fontSize: 12, marginTop: 2 }}>Powered by Claude AI · McKinsey-style analysis</div>
                  </div>
                  {aiText && <span style={{ background: "#f0fdf4", color: "#22c55e", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "1px solid #86efac" }}>✓ Generated</span>}
                </div>
                {aiLoad && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${B}`, borderTop: "3px solid #6366f1", animation: "spin 1s linear infinite" }} />
                    <div style={{ color: M, fontSize: 14 }}>Claude AI is analyzing your data...</div>
                  </div>
                )}
                {!aiLoad && !aiText && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }}>
                    <div style={{ fontSize: 48 }}>🤖</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Ready to Analyze</div>
                    <div style={{ color: M, fontSize: 13, textAlign: "center", maxWidth: 300 }}>Click "Generate Executive Report" to get AI-powered retention strategies based on your real data.</div>
                  </div>
                )}
                {aiText && (
                  <div style={{ background: dark ? "#060d1a" : "#f8faff", borderRadius: 12, padding: 24, border: `1px solid ${B}`, fontSize: 13, lineHeight: 1.8, color: T, whiteSpace: "pre-wrap", maxHeight: 520, overflowY: "auto" }}>
                    {aiText}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${B}; border-radius: 3px; }
        input:focus, select:focus { outline: 2px solid #6366f1; outline-offset: -1px; }
      `}</style>
    </div>
  );
}