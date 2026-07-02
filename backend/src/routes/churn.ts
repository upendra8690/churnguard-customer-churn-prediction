import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "../data/churnguard_data.csv");

interface RawRow {
  customerID?: string;
  gender?: string;
  SeniorCitizen?: string | number;
  tenure?: string | number;
  PhoneService?: string;
  InternetService?: string;
  Contract?: string;
  PaperlessBilling?: string;
  PaymentMethod?: string;
  MonthlyCharges?: string | number;
  TotalCharges?: string | number;
  Churn?: string;
}

interface CleanRow {
  customerId: string;
  gender: string;
  seniorCitizen: number;
  tenure: number;
  phoneService: string;
  internetService: string;
  contract: string;
  paperlessBilling: string;
  paymentMethod: string;
  monthlyCharges: number;
  totalCharges: number;
  churn: string;
  churnBinary: number;
}

function normalizeStr(v: unknown): string {
  if (v == null) return "";
  return String(v).trim().toLowerCase();
}

function normalizeYesNo(v: unknown): string {
  const s = normalizeStr(v);
  if (s === "yes" || s === "y") return "Yes";
  if (s === "no" || s === "n") return "No";
  return "";
}

function normalizeContract(v: unknown): string {
  const s = normalizeStr(v);
  if (s === "month-to-month" || s === "month to month" || s === "monthly") return "Month-to-month";
  if (s === "one year" || s === "1 year") return "One year";
  if (s === "two year" || s === "2 year") return "Two year";
  return "Month-to-month";
}

function normalizeInternet(v: unknown): string {
  const s = normalizeStr(v);
  if (s === "fiber optic" || s === "fiberoptic" || s === "fibre optic") return "Fiber optic";
  if (s === "dsl") return "DSL";
  if (s === "no") return "No";
  return String(v ?? "").trim();
}

function normalizePayment(v: unknown): string {
  return String(v ?? "").trim().replace(/\s+/g, " ").trim();
}

function parseNum(v: unknown): number | null {
  if (v == null || v === "" || v === "--" || v === "N/A") return null;
  const n = parseFloat(String(v));
  return isNaN(n) || n < 0 ? null : n;
}

let _cache: CleanRow[] | null = null;

function loadData(): CleanRow[] {
  if (_cache) return _cache;

  const csvText = fs.readFileSync(CSV_PATH, "utf8");
  const { data: raw } = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const seen = new Set<string>();
  const rows: CleanRow[] = [];

  for (const r of raw) {
    const id = String(r.customerID ?? "").trim();
    if (!id || seen.has(id)) continue;

    const churnRaw = normalizeYesNo(r.Churn);
    if (!churnRaw) continue;

    const tenure = parseNum(r.tenure);
    const monthlyCharges = parseNum(r.MonthlyCharges);
    const totalCharges = parseNum(r.TotalCharges);

    if (tenure === null || tenure < 0) continue;

    seen.add(id);
    rows.push({
      customerId: id,
      gender: String(r.gender ?? "").trim() || "Unknown",
      seniorCitizen: Number(r.SeniorCitizen) === 1 ? 1 : 0,
      tenure: tenure,
      phoneService: normalizeYesNo(r.PhoneService) || "Unknown",
      internetService: normalizeInternet(r.InternetService),
      contract: normalizeContract(r.Contract),
      paperlessBilling: normalizeYesNo(r.PaperlessBilling) || "Unknown",
      paymentMethod: normalizePayment(r.PaymentMethod),
      monthlyCharges: monthlyCharges ?? 0,
      totalCharges: totalCharges ?? 0,
      churn: churnRaw,
      churnBinary: churnRaw === "Yes" ? 1 : 0,
    });
  }

  _cache = rows;
  return rows;
}

function avg(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

router.get("/summary", (_req, res) => {
  const rows = loadData();
  const churned = rows.filter((r) => r.churnBinary === 1);
  const retained = rows.filter((r) => r.churnBinary === 0);
  const seniors = rows.filter((r) => r.seniorCitizen === 1);
  const seniorChurned = seniors.filter((r) => r.churnBinary === 1);

  res.json({
    totalCustomers: rows.length,
    churnedCustomers: churned.length,
    retainedCustomers: retained.length,
    churnRate: rows.length ? (churned.length / rows.length) * 100 : 0,
    avgMonthlyChargesChurned: avg(churned.map((r) => r.monthlyCharges)),
    avgMonthlyChargesRetained: avg(retained.map((r) => r.monthlyCharges)),
    avgTenureChurned: avg(churned.map((r) => r.tenure)),
    avgTenureRetained: avg(retained.map((r) => r.tenure)),
    seniorChurnRate: seniors.length ? (seniorChurned.length / seniors.length) * 100 : 0,
  });
});

router.get("/by-contract", (_req, res) => {
  const rows = loadData();
  const groups = new Map<string, { total: number; churned: number }>();
  for (const r of rows) {
    const g = r.contract;
    if (!groups.has(g)) groups.set(g, { total: 0, churned: 0 });
    const entry = groups.get(g)!;
    entry.total++;
    if (r.churnBinary === 1) entry.churned++;
  }
  const result = Array.from(groups.entries()).map(([group, { total, churned }]) => ({
    group,
    total,
    churned,
    retained: total - churned,
    churnRate: total ? (churned / total) * 100 : 0,
  }));
  res.json(result);
});

router.get("/by-internet", (_req, res) => {
  const rows = loadData();
  const groups = new Map<string, { total: number; churned: number }>();
  for (const r of rows) {
    const g = r.internetService || "Unknown";
    if (!groups.has(g)) groups.set(g, { total: 0, churned: 0 });
    const entry = groups.get(g)!;
    entry.total++;
    if (r.churnBinary === 1) entry.churned++;
  }
  const result = Array.from(groups.entries()).map(([group, { total, churned }]) => ({
    group,
    total,
    churned,
    retained: total - churned,
    churnRate: total ? (churned / total) * 100 : 0,
  }));
  res.json(result);
});

router.get("/by-payment", (_req, res) => {
  const rows = loadData();
  const groups = new Map<string, { total: number; churned: number }>();
  for (const r of rows) {
    const g = r.paymentMethod || "Unknown";
    if (!groups.has(g)) groups.set(g, { total: 0, churned: 0 });
    const entry = groups.get(g)!;
    entry.total++;
    if (r.churnBinary === 1) entry.churned++;
  }
  const result = Array.from(groups.entries()).map(([group, { total, churned }]) => ({
    group,
    total,
    churned,
    retained: total - churned,
    churnRate: total ? (churned / total) * 100 : 0,
  }));
  res.json(result);
});

router.get("/tenure-distribution", (_req, res) => {
  const rows = loadData();
  const BUCKETS = [
    { label: "0-12 mo", min: 0, max: 12 },
    { label: "13-24 mo", min: 13, max: 24 },
    { label: "25-36 mo", min: 25, max: 36 },
    { label: "37-48 mo", min: 37, max: 48 },
    { label: "49-60 mo", min: 49, max: 60 },
    { label: "61+ mo", min: 61, max: Infinity },
  ];
  const result = BUCKETS.map(({ label, min, max }) => {
    const inBucket = rows.filter((r) => r.tenure >= min && r.tenure <= max);
    return {
      bucket: label,
      churned: inBucket.filter((r) => r.churnBinary === 1).length,
      retained: inBucket.filter((r) => r.churnBinary === 0).length,
    };
  });
  res.json(result);
});

router.get("/monthly-charges", (_req, res) => {
  const rows = loadData();
  const churned = rows.filter((r) => r.churnBinary === 1);
  const retained = rows.filter((r) => r.churnBinary === 0);

  const CHARGE_BUCKETS = [
    { label: "$0-30", min: 0, max: 30 },
    { label: "$30-60", min: 30, max: 60 },
    { label: "$60-90", min: 60, max: 90 },
    { label: "$90-120", min: 90, max: 120 },
    { label: "$120+", min: 120, max: Infinity },
  ];

  const buckets = CHARGE_BUCKETS.map(({ label, min, max }) => ({
    range: label,
    churned: churned.filter((r) => r.monthlyCharges >= min && r.monthlyCharges < max).length,
    retained: retained.filter((r) => r.monthlyCharges >= min && r.monthlyCharges < max).length,
  }));

  res.json({
    churned: avg(churned.map((r) => r.monthlyCharges)),
    retained: avg(retained.map((r) => r.monthlyCharges)),
    buckets,
  });
});

router.get("/customers", (_req, res) => {
  const rows = loadData();
  const result = rows.map((r) => {
    const churnScore = computeChurnScore(r);
    return {
      customerId: r.customerId,
      gender: r.gender,
      seniorCitizen: r.seniorCitizen,
      tenure: r.tenure,
      internetService: r.internetService,
      contract: r.contract,
      monthlyCharges: r.monthlyCharges,
      totalCharges: r.totalCharges,
      churn: r.churn,
      churnScore,
    };
  });
  res.json(result);
});

function computeChurnScore(r: CleanRow): number {
  let score = 0;
  if (r.contract === "Month-to-month") score += 35;
  else if (r.contract === "One year") score += 15;
  if (r.internetService === "Fiber optic") score += 20;
  if (r.seniorCitizen === 1) score += 15;
  if (r.tenure <= 12) score += 20;
  else if (r.tenure <= 24) score += 10;
  if (r.monthlyCharges > 80) score += 10;
  return Math.min(score, 100);
}

router.post("/predict", (req, res) => {
  const { tenure, monthlyCharges, totalCharges, seniorCitizen, contract } = req.body as {
    tenure: number;
    monthlyCharges: number;
    totalCharges: number;
    seniorCitizen: number;
    contract: number;
  };

  const rows = loadData();
  const churned = rows.filter((r) => r.churnBinary === 1);
  const retained = rows.filter((r) => r.churnBinary === 0);

  const avgChurnedTenure = avg(churned.map((r) => r.tenure));
  const avgRetainedTenure = avg(retained.map((r) => r.tenure));
  const avgChurnedMonthly = avg(churned.map((r) => r.monthlyCharges));
  const avgRetainedMonthly = avg(retained.map((r) => r.monthlyCharges));

  const churnRate = churned.length / rows.length;

  const tenuureScore = tenure < avgChurnedTenure ? 0.6 : 0.3;
  const monthlyScore = monthlyCharges > avgChurnedMonthly ? 0.7 : 0.4;
  const contractScore = contract === 0 ? 0.75 : contract === 1 ? 0.35 : 0.1;
  const seniorScore = seniorCitizen === 1 ? 0.65 : 0.45;
  const avgRetainedTotal = avg(retained.map((r) => r.totalCharges));
  const totalScore = totalCharges < avgRetainedTotal * 0.5 ? 0.65 : 0.4;

  const rawProb =
    churnRate * 0.1 +
    tenuureScore * 0.25 +
    monthlyScore * 0.2 +
    contractScore * 0.3 +
    seniorScore * 0.1 +
    totalScore * 0.05;

  const clampedProb = Math.min(Math.max(rawProb, 0.02), 0.97);
  const prediction = clampedProb >= 0.5 ? 1 : 0;

  res.json({
    prediction,
    churnProbability: Math.round(clampedProb * 1000) / 10,
    label: prediction === 1 ? "Likely to Churn" : "Likely to Stay",
  });
});

router.post("/ai-advisor", async (_req, res) => {
  const rows = loadData();
  const churned = rows.filter((r) => r.churnBinary === 1);
  const retained = rows.filter((r) => r.churnBinary === 0);
  const churnRate = rows.length ? (churned.length / rows.length) * 100 : 0;
  const seniors = rows.filter((r) => r.seniorCitizen === 1);
  const seniorChurned = seniors.filter((r) => r.churnBinary === 1);
  const seniorChurnRate = seniors.length ? (seniorChurned.length / seniors.length) * 100 : 0;

  const groups = new Map<string, { total: number; churned: number }>();
  for (const r of rows) {
    const g = r.contract;
    if (!groups.has(g)) groups.set(g, { total: 0, churned: 0 });
    const e = groups.get(g)!;
    e.total++;
    if (r.churnBinary === 1) e.churned++;
  }
  const contractSummary = Array.from(groups.entries())
    .map(([g, { total, churned }]) => `${g} (${total ? ((churned / total) * 100).toFixed(0) : 0}% churn)`)
    .join(", ");

  const ctx = `Telecom churn analytics: ${rows.length} customers, ${churnRate.toFixed(1)}% overall churn rate, senior churn rate ${seniorChurnRate.toFixed(1)}%, avg monthly charges retained $${avg(retained.map((r) => r.monthlyCharges)).toFixed(0)} vs churned $${avg(churned.map((r) => r.monthlyCharges)).toFixed(0)}. Contract breakdown: ${contractSummary}.`;

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    res.json({
      demo: true,
      text:
        "🔒 Demo mode — no ANTHROPIC_API_KEY is set on this server, so this is a sample response.\n\n" +
        "1. Month-to-month contracts drive most churn — a modest discount for annual upgrades could meaningfully reduce it.\n" +
        "2. Senior customers churn at an elevated rate — a simplified, dedicated support tier may help.\n" +
        "3. Fiber optic customers churn more than DSL — worth reviewing pricing against perceived value.\n\n" +
        "To enable live AI: get a key at console.anthropic.com and add it as an environment variable named ANTHROPIC_API_KEY on the server (this is a paid API — usage for occasional demo use is typically a few cents).",
    });
    return;
  }

  try {
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: `You are a senior telecom business consultant. Data: ${ctx}\n\nProvide 3 specific, data-driven retention recommendations, 2-3 sentences each.` }],
      }),
    });
    const data: any = await aiRes.json();
    res.json({ demo: false, text: data?.content?.[0]?.text || "No response from AI." });
  } catch {
    res.status(500).json({ demo: true, text: "AI request failed — check server logs and API key." });
  }
});

export default router;
