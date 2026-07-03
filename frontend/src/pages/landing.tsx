import { useState, useEffect, useRef } from "react";

const LOGOS = [
  { display: "React",        style: { fontSize: 22, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "TypeScript",   style: { fontSize: 19, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "Node.js",      style: { fontSize: 21, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "Express",      style: { fontSize: 21, fontWeight: 600, fontFamily: "Arial,sans-serif" } },
  { display: "Vite",         style: { fontSize: 22, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "Python",       style: { fontSize: 21, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "scikit-learn", style: { fontSize: 16, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "pandas",       style: { fontSize: 20, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "Recharts",     style: { fontSize: 19, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "TanStack Query", style: { fontSize: 15, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "Claude API",   style: { fontSize: 18, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
  { display: "GitHub",       style: { fontSize: 20, fontWeight: 700, fontFamily: "Arial,sans-serif" } },
];

const FEATURES = [
  { icon: "📊", title: "Real-Time Analytics",    desc: "Live churn monitoring across all segments. Every API call, every chart update — sub-second." },
  { icon: "🔮", title: "ML Risk Engine",          desc: "Weighted model scores every customer 0–100 using contract, tenure, charges, and 8 other signals." },
  { icon: "🤖", title: "Claude AI Advisor",       desc: "Powered by Anthropic's Claude. Generates McKinsey-grade executive retention recommendations from your live data." },
  { icon: "👥", title: "Customer Registry",       desc: "940+ customers. Searchable, sortable, filterable. One-click CSV export. Full pagination." },
  { icon: "📈", title: "5 Chart Dimensions",      desc: "Contract, internet service, payment method, tenure buckets, monthly charges — all live." },
  { icon: "⚡",  title: "8 REST API Endpoints",   desc: "Full OpenAPI 3.1 spec. Integrate ChurnGuard into any stack in minutes. Zero auth required." },
  { icon: "🌙", title: "Dark / Light Mode",       desc: "System-aware theme switching. Every component, every chart — perfectly themed." },
  { icon: "⬇",  title: "Instant CSV Export",      desc: "Export any filtered view in one click. Bring your own BI tool — the data is always yours." },
  { icon: "🔐", title: "Open Source",             desc: "Full source code on GitHub. Fork it, self-host it, extend it. No black boxes, ever." },
];

const STATS = [
  { val: "940+",  label: "Customers Analyzed",    color: "#3b82f6" },
  { val: "32.1%", label: "Churn Rate Detected",   color: "#ef4444" },
  { val: "8",     label: "Live API Endpoints",    color: "#8b5cf6" },
  { val: "< 1s",  label: "Prediction Speed",      color: "#22c55e" },
];

const VALUES = [
  { icon: "🎯", title: "Built to be genuinely useful", desc: "Every feature exists because a churn dashboard should help someone make a real decision — not just look good in a screenshot.", color: "#6366f1" },
  { icon: "🔓", title: "Free means free", desc: "No trial period, no feature paywall, no 'contact sales.' The full dashboard, the API, and the ML model are yours to use and modify.", color: "#8b5cf6" },
  { icon: "🌱", title: "Built solo, in the open", desc: "This is one developer's project, shipped publicly. The roadmap below is real, and it updates as work actually gets done.", color: "#3b82f6" },
];

const ROADMAP_DATA = [
  {
    quarter: "Q3 2026", label: "Live Now ✅", color: "#22c55e", icon: "✅", status: "live",
    desc: "The foundation. Every feature is live, free, and production-ready right now.",
    items: [
      { text: "Real-time churn analytics dashboard", done: true },
      { text: "ML weighted risk scoring (0–100)",    done: true },
      { text: "Claude AI executive advisor",         done: true },
      { text: "8 REST API endpoints + OpenAPI spec", done: true },
      { text: "CSV export & customer registry",      done: true },
      { text: "Dark mode + responsive design",       done: true },
    ],
  },
  {
    quarter: "Q4 2026", label: "Next Up 🔧", color: "#6366f1", icon: "🔧", status: "next",
    desc: "Integrations and automation — pushing ChurnGuard into every tool your team uses.",
    items: [
      { text: "Slack & email real-time alerts",      done: false },
      { text: "Salesforce CRM two-way sync",         done: false },
      { text: "HubSpot & Intercom integration",      done: false },
      { text: "Custom risk model training UI",       done: false },
      { text: "Team workspaces & role permissions",  done: false },
      { text: "White-label embed (iframe SDK)",      done: false },
    ],
  },
  {
    quarter: "Q1 2027", label: "Horizon 🚀", color: "#8b5cf6", icon: "🚀", status: "future",
    desc: "Enterprise-grade security, predictive cohort tools, and multi-tenant capabilities.",
    items: [
      { text: "Predictive cohort analysis",          done: false },
      { text: "Revenue recovery playbooks",          done: false },
      { text: "Multi-tenant SaaS mode",              done: false },
      { text: "SOC 2 Type II certification",         done: false },
      { text: "Enterprise SSO / SAML",               done: false },
      { text: "Audit logs & GDPR compliance",        done: false },
    ],
  },
  {
    quarter: "Q2 2027", label: "Vision 🌟", color: "#a78bfa", icon: "🌟", status: "vision",
    desc: "The long-term vision: ChurnGuard as the operating system for customer retention.",
    items: [
      { text: "Real-time A/B retention experiments", done: false },
      { text: "AI-generated outreach emails",        done: false },
      { text: "Churn causality knowledge graph",     done: false },
      { text: "Global industry churn benchmark",     done: false },
      { text: "Open-source TypeScript + Python SDK", done: false },
      { text: "Native iOS & Android app",            done: false },
    ],
  },
];

const FUTURE_CARDS = [
  { icon: "🧠", title: "Autonomous Retention AI",       tag: "2027",     color: "#6366f1", desc: "ChurnGuard will automatically detect at-risk customers, generate personalized outreach, schedule follow-ups, and track outcomes — all without human intervention. Your team becomes 10x more effective." },
  { icon: "🌍", title: "Global Churn Benchmark Index",  tag: "2027",     color: "#8b5cf6", desc: "Real-time benchmarks so you know how your churn compares to your sector, company size, and geography. Stop guessing if 32% is good or bad — know in seconds." },
  { icon: "🔗", title: "Universal CRM Integration",     tag: "Q4 2026",  color: "#3b82f6", desc: "Plug into Salesforce, HubSpot, Intercom, Zendesk, and 50+ tools. Risk scores flow into every system your team already uses — no workflow changes required." },
  { icon: "📱", title: "Mobile Command Center",         tag: "2027",     color: "#0ea5e9", desc: "Native iOS and Android apps. Real-time churn alerts, risk score reviews, and AI outreach approvals — from your pocket, anywhere in the world." },
  { icon: "🧪", title: "Live A/B Retention Tests",      tag: "Q1 2027",  color: "#f59e0b", desc: "Run controlled experiments on retention interventions. Test discounts vs support calls vs product tutorials — with built-in statistical significance." },
  { icon: "🏗",  title: "Open Source SDK",              tag: "Q2 2027",  color: "#22c55e", desc: "Fully open TypeScript and Python SDK. Embed ChurnGuard's risk scoring engine directly into your own products, dashboards, and data pipelines." },
  { icon: "🔐", title: "Enterprise Security Suite",     tag: "Q1 2027",  color: "#ef4444", desc: "SOC 2 Type II, SSO/SAML, RBAC, audit logs, data residency, GDPR tooling — everything Fortune 500 procurement requires." },
  { icon: "🤖", title: "Multi-Model AI Layer",          tag: "2027",     color: "#a78bfa", desc: "Beyond Claude — GPT-4, Gemini, and custom fine-tuned churn models. Choose the AI that fits your privacy and performance requirements." },
  { icon: "📊", title: "Predictive Revenue Forecasting", tag: "Q2 2027", color: "#f97316", desc: "Not just who will churn — exactly how much MRR you'll lose next month, quarter, and year. CFO-ready forecasts built on real churn predictions." },
];

const IMPACT = [
  { val: "1",    label: "Solo developer",     color: "#6366f1" },
  { val: "8",    label: "REST API endpoints", color: "#22c55e" },
  { val: "100%", label: "Open source",        color: "#8b5cf6" },
  { val: "$0",   label: "Cost, forever",      color: "#3b82f6" },
];

const B = "#1e2d45";
const C = "#060d1a";
const C2 = "#0d1526";

export default function Landing({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled]       = useState(false);
  const [activeTab, setActiveTab]     = useState(0);
  const [email, setEmail]             = useState("");
  const [joined, setJoined]           = useState(false);
  const [visibleCards, setVisible]    = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = parseInt((e.target as HTMLElement).dataset.idx || "0");
          setVisible(prev => new Set([...prev, idx]));
        }
      });
    }, { threshold: 0.15 });
    cardRefs.current.forEach(r => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: C, color: "#e8edf8", fontFamily: "'Inter',system-ui,sans-serif", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(6,13,26,0.98)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? `1px solid ${B}` : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 14px #6366f166" }}>🛡️</div>
          <span style={{ fontWeight: 900, fontSize: 18, background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ChurnGuard</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Features", "Customers", "Roadmap", "Future", "Docs"].map(l => (
            <a key={l} href="#" style={{ color: "#475569", fontSize: 14, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e8edf8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${B}`, background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>⭐ Star on GitHub</button>
          <button onClick={onEnter} style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 16px #6366f155" }}>Open Dashboard →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "130px 40px 90px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 55% at 50% 38%,#6366f114,transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "15%", left: "5%",  width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#8b5cf609,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", right: "4%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#3b82f609,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C2, border: "1px solid #6366f133", borderRadius: 24, padding: "7px 20px", marginBottom: 36, fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.05em" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 12px #22c55e" }} />
          FREE FOREVER · No Signup · No Credit Card · Open Source
        </div>

        <h1 style={{ fontSize: "clamp(40px,6.5vw,86px)", fontWeight: 900, lineHeight: 1.02, margin: "0 0 28px", letterSpacing: "-0.038em", maxWidth: 920 }}>
          Stop Losing Customers.<br />
          <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa 40%,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Start Predicting Churn.
          </span>
        </h1>

        <p style={{ fontSize: 19, color: "#475569", maxWidth: 580, lineHeight: 1.8, margin: "0 0 48px" }}>
          An open-source churn intelligence platform, built solo. Real-time analytics, ML risk scoring, and an optional Claude AI advisor — completely free, forever.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 22 }}>
          <button onClick={onEnter}
            style={{ padding: "17px 40px", borderRadius: 13, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", fontSize: 17, fontWeight: 900, boxShadow: "0 10px 44px #6366f166", transition: "all 0.15s", letterSpacing: "0.01em" }}
            onMouseEnter={e => { (e.currentTarget as any).style.transform = "translateY(-3px)"; (e.currentTarget as any).style.boxShadow = "0 16px 56px #6366f188"; }}
            onMouseLeave={e => { (e.currentTarget as any).style.transform = "translateY(0)"; (e.currentTarget as any).style.boxShadow = "0 10px 44px #6366f166"; }}>
            Launch Free Dashboard →
          </button>
          <button style={{ padding: "17px 32px", borderRadius: 13, border: `1px solid ${B}`, background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 16, fontWeight: 600 }}>
            ▶ Watch Demo
          </button>
        </div>

        <div style={{ color: "#1e3a5f", fontSize: 13, display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", marginBottom: 80 }}>
          {["✓ No signup", "✓ Full features", "✓ AI included", "✓ API access", "✓ Export CSV", "✓ Open source"].map(t => <span key={t}>{t}</span>)}
        </div>

        <div style={{ display: "flex", gap: 0, border: `1px solid ${B}`, borderRadius: 18, overflow: "hidden", background: "#0d152299" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: "22px 44px", borderRight: i < STATS.length - 1 ? `1px solid ${B}` : "none", textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#334155", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TRUSTED BY ── */}
      <div style={{ borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, padding: "72px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
            <div style={{ flex: 1, maxWidth: 200, height: 1, background: `linear-gradient(90deg,transparent,${B})` }} />
            <span style={{ fontSize: 11, color: "#334155", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, whiteSpace: "nowrap" }}>BUILT WITH</span>
            <div style={{ flex: 1, maxWidth: 200, height: 1, background: `linear-gradient(90deg,${B},transparent)` }} />
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", border: `1px solid ${B}`, borderRadius: 4, overflow: "hidden" }}>
            {LOGOS.map((logo, i) => {
              const cols = 6;
              const isLastCol = i % cols === cols - 1;
              const isLastRow = i >= LOGOS.length - cols;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 80, padding: "12px 16px", borderRight: isLastCol ? "none" : `1px solid ${B}`, borderBottom: isLastRow ? "none" : `1px solid ${B}`, transition: "background 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as any).style.background = "#0d152699"; }}
                  onMouseLeave={e => { (e.currentTarget as any).style.background = "transparent"; }}>
                  <span style={{ ...logo.style, color: "rgba(255,255,255,0.36)", transition: "color 0.2s", userSelect: "none" } as any}
                    onMouseEnter={e => { (e.currentTarget as any).style.color = "rgba(255,255,255,0.9)"; }}
                    onMouseLeave={e => { (e.currentTarget as any).style.color = "rgba(255,255,255,0.36)"; }}>
                    {logo.display}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding: "110px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontSize: 11, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16, fontWeight: 700 }}>Platform Features</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, margin: "0 0 18px", letterSpacing: "-0.025em" }}>
            Everything you need.<br />
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nothing you don't. Free.</span>
          </h2>
          <p style={{ color: "#475569", fontSize: 17, maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>Built for data teams who need answers fast. No PhD required. No pricing tiers. No vendor lock-in.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: `1px solid ${B}`, borderRadius: 20, overflow: "hidden" }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              ref={el => { cardRefs.current[i] = el; }}
              data-idx={i}
              style={{ padding: "36px 32px", borderRight: i % 3 !== 2 ? `1px solid ${B}` : "none", borderBottom: i < 6 ? `1px solid ${B}` : "none", transition: "background 0.2s, transform 0.4s, opacity 0.4s", opacity: visibleCards.has(i) ? 1 : 0, transform: visibleCards.has(i) ? "translateY(0)" : "translateY(20px)" }}
              onMouseEnter={e => { (e.currentTarget as any).style.background = C2; }}
              onMouseLeave={e => { (e.currentTarget as any).style.background = "transparent"; }}>
              <div style={{ fontSize: 26, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: "#e2e8f0" }}>{f.title}</div>
              <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.8 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DASHBOARD PREVIEW ── */}
      <div style={{ padding: "0 48px 110px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#0d1526,#111d30)", border: `1px solid ${B}`, borderRadius: 24, padding: "48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -120, right: -120, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,#6366f110,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 20, position: "relative" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }} />
                <span style={{ fontSize: 11, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Live Dashboard Preview</span>
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.025em" }}>See it in action</h2>
              <p style={{ color: "#475569", fontSize: 15, margin: 0 }}>Real data. Real AI. Zero cost.</p>
            </div>
            <button onClick={onEnter} style={{ padding: "13px 28px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, boxShadow: "0 4px 20px #6366f155" }}>Open Free Dashboard →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 12 }}>
            {[{ l: "Total Customers", v: "940", c: "#3b82f6" }, { l: "Churn Rate", v: "32.1%", c: "#ef4444" }, { l: "High Risk", v: "187", c: "#f59e0b" }, { l: "MRR at Risk", v: "$18.6K", c: "#8b5cf6" }].map(k => (
              <div key={k.l} style={{ background: C, borderRadius: 12, padding: "16px 20px", border: `1px solid ${B}` }}>
                <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{k.l}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: k.c }}>{k.v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 12 }}>
            <div style={{ background: C, borderRadius: 12, padding: "20px 22px", border: `1px solid ${B}` }}>
              <div style={{ fontSize: 11, color: "#334155", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Churn by Contract Type</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 80 }}>
                {[{ l: "Month-to-month", r: 70, c: 100 }, { l: "One year", r: 100, c: 18 }, { l: "Two year", r: 95, c: 5 }].map(b => (
                  <div key={b.l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 3, alignItems: "flex-end", width: "65%", marginBottom: 6 }}>
                      <div style={{ flex: 1, background: "#3b82f6", borderRadius: "3px 3px 0 0", height: `${b.r * 0.7}px`, opacity: 0.85 }} />
                      <div style={{ flex: 1, background: "#8b5cf6", borderRadius: "3px 3px 0 0", height: `${b.c * 0.7}px`, opacity: 0.85 }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#334155", textAlign: "center" }}>{b.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                {[{ c: "#3b82f6", l: "Retained" }, { c: "#8b5cf6", l: "Churned" }].map(x => (
                  <div key={x.l} style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 11, color: "#475569" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />{x.l}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C, borderRadius: 12, padding: "20px 22px", border: `1px solid ${B}` }}>
              <div style={{ fontSize: 11, color: "#334155", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Risk Segments</div>
              {[{ l: "High Risk", p: 20, c: "#ef4444" }, { l: "Medium", p: 35, c: "#f59e0b" }, { l: "Low Risk", p: 45, c: "#22c55e" }].map(r => (
                <div key={r.l} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11 }}>
                    <span style={{ color: "#475569" }}>{r.l}</span>
                    <span style={{ color: r.c, fontWeight: 700 }}>{r.p}%</span>
                  </div>
                  <div style={{ background: B, borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${r.p * 2}%`, background: r.c, height: 6, borderRadius: 4, transition: "width 1.2s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY THIS EXISTS ── */}
      <div style={{ borderTop: `1px solid ${B}`, padding: "110px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 16 }}>Why This Exists</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, margin: 0, letterSpacing: "-0.025em" }}>
              Built to be useful.<br />
              <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not to impress a room.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: C2, border: `1px solid ${B}`, borderRadius: 20, padding: 32, position: "relative", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as any).style.borderColor = v.color + "55"; (e.currentTarget as any).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as any).style.borderColor = B; (e.currentTarget as any).style.transform = "translateY(0)"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${v.color},transparent)` }} />
                <div style={{ fontSize: 30, marginBottom: 16 }}>{v.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: "#e2e8f0" }}>{v.title}</div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROADMAP ── */}
      <div style={{ borderTop: `1px solid ${B}`, padding: "110px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 16 }}>Public Roadmap</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, margin: "0 0 18px", letterSpacing: "-0.025em" }}>
              Transparent. Public. Committed.<br />
              <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>No vaporware — only real dates.</span>
            </h2>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 44, flexWrap: "wrap" }}>
            {ROADMAP_DATA.map((r, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                style={{ padding: "10px 24px", borderRadius: 24, border: `1px solid ${activeTab === i ? r.color : B}`, background: activeTab === i ? r.color + "22" : "transparent", color: activeTab === i ? r.color : "#475569", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}>
                {r.icon} {r.quarter}
              </button>
            ))}
          </div>

          {ROADMAP_DATA.map((r, i) => i === activeTab && (
            <div key={i} style={{ background: C2, border: `1px solid ${r.color}44`, borderRadius: 22, padding: "44px 48px", position: "relative", overflow: "hidden", maxWidth: 900, margin: "0 auto" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${r.color},transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ display: "inline-block", background: r.color + "22", border: `1px solid ${r.color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 12, color: r.color, fontWeight: 700, marginBottom: 12 }}>{r.label}</div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px" }}>{r.quarter}</h3>
                  <p style={{ color: "#475569", fontSize: 14, margin: 0, maxWidth: 520, lineHeight: 1.7 }}>{r.desc}</p>
                </div>
                <span style={{ fontSize: 52 }}>{r.icon}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {r.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C, borderRadius: 10, padding: "12px 16px", border: `1px solid ${B}` }}>
                    <span style={{ color: item.done ? "#22c55e" : r.color + "77", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{item.done ? "✓" : "○"}</span>
                    <span style={{ fontSize: 13, color: item.done ? "#94a3b8" : "#64748b", lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 52, maxWidth: 900, margin: "52px auto 0" }}>
            <div style={{ height: 3, background: `linear-gradient(90deg,#22c55e,#6366f1,#8b5cf6,#a78bfa)`, borderRadius: 3, marginBottom: 16 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {ROADMAP_DATA.map((r, i) => (
                <div key={i} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setActiveTab(i)}>
                  <div style={{ fontSize: 11, color: activeTab === i ? r.color : "#334155", fontWeight: activeTab === i ? 700 : 400, marginBottom: 3, transition: "color 0.2s" }}>{r.quarter}</div>
                  <div style={{ fontSize: 11, color: "#1e3a5f" }}>{r.items.length} features</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FUTURE VISION ── */}
      <div style={{ borderTop: `1px solid ${B}`, padding: "120px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 50%,#6366f109,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontSize: 11, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 16 }}>The Future</div>
            <h2 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.03em", lineHeight: 1.08 }}>
              We're just getting started.<br />
              <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The future of retention is here.</span>
            </h2>
            <p style={{ color: "#475569", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.8 }}>
              ChurnGuard is evolving into the world's most complete customer retention operating system — open, intelligent, and built for every company on Earth.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 80 }}>
            {IMPACT.map(n => (
              <div key={n.label} style={{ background: C2, border: `1px solid ${B}`, borderRadius: 16, padding: "26px 22px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${n.color},transparent)` }} />
                <div style={{ fontSize: 34, fontWeight: 900, color: n.color, marginBottom: 8 }}>{n.val}</div>
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{n.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {FUTURE_CARDS.map((v, i) => (
              <div key={i} style={{ background: C2, border: `1px solid ${B}`, borderRadius: 18, padding: "26px 24px", position: "relative", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as any).style.borderColor = v.color + "66"; (e.currentTarget as any).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as any).style.borderColor = B; (e.currentTarget as any).style.transform = "translateY(0)"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${v.color}55,transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: v.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{v.icon}</div>
                  <span style={{ background: v.color + "18", color: v.color, border: `1px solid ${v.color}33`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{v.tag}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: "#e2e8f0" }}>{v.title}</div>
                <div style={{ color: "#475569", fontSize: 13, lineHeight: 1.75 }}>{v.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 80, background: "linear-gradient(135deg,#0d1526,#111d30)", border: `1px solid ${B}`, borderRadius: 24, padding: "60px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 50% 50%,#6366f10c,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>🌍</div>
              <h3 style={{ fontSize: "clamp(22px,3.5vw,44px)", fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
                Our mission: Make churn intelligence<br />
                <span style={{ background: "linear-gradient(135deg,#22c55e,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>accessible to every company on Earth.</span>
              </h3>
              <p style={{ color: "#475569", fontSize: 17, maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.8 }}>
                Right now, enterprise-grade churn intelligence costs $50,000/year and requires a data science team. We're changing that. ChurnGuard is free, open-source, and powerful enough for the world's largest companies — yet simple enough for a two-person startup to deploy in minutes.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={onEnter} style={{ padding: "14px 34px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 800, boxShadow: "0 8px 32px #6366f155" }}>
                  Join the Mission — It's Free →
                </button>
                <button style={{ padding: "14px 28px", borderRadius: 12, border: `1px solid ${B}`, background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
                  ⭐ Star on GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WAITLIST ── */}
      <div style={{ borderTop: `1px solid ${B}`, padding: "90px 48px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 16 }}>Stay Ahead</div>
          <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.025em" }}>Get notified when new features ship</h2>
          <p style={{ color: "#475569", fontSize: 16, margin: "0 0 32px", lineHeight: 1.7 }}>Slack alerts, CRM sync, mobile app, open-source SDK — be the first to know.</p>
          {!joined ? (
            <div style={{ display: "flex", gap: 10, maxWidth: 460, margin: "0 auto" }}>
              <input placeholder="your@company.com" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && email) setJoined(true); }}
                style={{ flex: 1, padding: "13px 18px", borderRadius: 10, border: `1px solid ${B}`, background: C2, color: "#e8edf8", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#6366f166")}
                onBlur={e => (e.currentTarget.style.borderColor = B)} />
              <button onClick={() => { if (email) setJoined(true); }} style={{ padding: "13px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 20px #6366f155" }}>
                Notify Me →
              </button>
            </div>
          ) : (
            <div style={{ background: "#0d2618", border: "1px solid #22c55e44", borderRadius: 12, padding: "16px 28px", color: "#22c55e", fontWeight: 700, fontSize: 15 }}>
              ✓ You're on the list! We ship fast — expect news soon.
            </div>
          )}
          <div style={{ color: "#1e3a5f", fontSize: 12, marginTop: 14 }}>No spam · Unsubscribe anytime · We ship weekly</div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div style={{ borderTop: `1px solid ${B}`, padding: "130px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%,#6366f10e,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0d2618", border: "1px solid #22c55e44", borderRadius: 24, padding: "7px 20px", marginBottom: 36, fontSize: 12, color: "#22c55e", fontWeight: 700 }}>
            ✓ 100% Free Forever — No Catch, No Limits, No Signup
          </div>
          <h2 style={{ fontSize: "clamp(34px,5.5vw,68px)", fontWeight: 900, margin: "0 0 24px", letterSpacing: "-0.035em", lineHeight: 1.05 }}>
            Start fighting churn<br />
            <span style={{ background: "linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>right now. It's free.</span>
          </h2>
          <p style={{ color: "#475569", fontSize: 18, margin: "0 0 48px", lineHeight: 1.8 }}>
            No signup. No credit card. No limits. Open the dashboard and start predicting which customers are about to leave — before they do.
          </p>
          <button onClick={onEnter}
            style={{ padding: "22px 60px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", fontSize: 20, fontWeight: 900, boxShadow: "0 12px 56px #6366f177", letterSpacing: "0.01em", display: "block", margin: "0 auto 28px", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as any).style.transform = "translateY(-4px)"; (e.currentTarget as any).style.boxShadow = "0 20px 70px #6366f199"; }}
            onMouseLeave={e => { (e.currentTarget as any).style.transform = "translateY(0)"; (e.currentTarget as any).style.boxShadow = "0 12px 56px #6366f177"; }}>
            Launch Free Dashboard →
          </button>
          <div style={{ color: "#1e3a5f", fontSize: 13, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            <span>✓ No signup</span><span>✓ Full features</span><span>✓ AI included</span><span>✓ Export CSV</span><span>✓ API access</span><span>✓ Open source</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: `1px solid ${B}`, padding: "36px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🛡️</div>
            <span style={{ fontWeight: 900, color: "#475569", fontSize: 15 }}>ChurnGuard</span>
            <span style={{ color: B, fontSize: 13, marginLeft: 4 }}>© 2026 · Free & Open Source</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["GitHub", "Privacy", "Terms", "Status", "Docs", "Blog"].map(l => (
              <a key={l} href="#" style={{ color: "#334155", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>{l}</a>
            ))}
          </div>
          <div style={{ color: B, fontSize: 13 }}>Built with ❤️ for retention teams worldwide</div>
        </div>
        <div style={{ borderTop: `1px solid ${B}`, paddingTop: 20, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {["Powered by Anthropic Claude AI", "Open API · No Auth Required", "TypeScript + React + Node.js", "MIT Licensed"].map(t => (
            <span key={t} style={{ fontSize: 11, color: "#1e3a5f", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#1e3a5f", display: "inline-block" }} />{t}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060d1a; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 3px; }
        input::placeholder { color: #334155; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}