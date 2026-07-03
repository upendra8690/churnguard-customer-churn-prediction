# 🛡️ ChurnGuard — Customer Churn Prediction Platform 📊

<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&pause=1000&color=6366F1&center=true&vCenter=true&width=650&lines=Real-time+Churn+Analytics+Dashboard;ML+Risk+Scoring+%2B+Optional+Claude+AI;Full-stack%3A+React+%2B+Express+%2B+Python;Open+Source+%C2%B7+Live+%C2%B7+Free" alt="Typing SVG" />

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/upendra8690/churnguard-customer-churn-prediction?style=for-the-badge&color=FFD700)
![Vercel](https://img.shields.io/github/deployments/upendra8690/churnguard-customer-churn-prediction/production?logo=vercel&label=vercel&style=for-the-badge)

<br/>

> **Predicts which customers are about to cancel — before they do.**
>
> *React dashboard · Express API · weighted ML risk engine · optional Claude AI advisor · Python scikit-learn model*

</div>

---

## 🎬 Live Demo

<div align="center">

| | |
|---|---|
| 🌐 **Website** | [churnguard-customer-churn-predictio.vercel.app](https://churnguard-customer-churn-predictio.vercel.app) |
| 📊 **Dashboard** | [churnguard-customer-churn-predictio.vercel.app/dashboard](https://churnguard-customer-churn-predictio.vercel.app/dashboard) |
| ⚡ **Backend API** | [churnguard-customer-churn-prediction.onrender.com](https://churnguard-customer-churn-prediction.onrender.com/api/churn/summary) |

</div>

> ⚠️ Backend runs on Render's free tier and sleeps when idle — the first request after inactivity takes 30-50 seconds to wake up. Normal, not a bug.

---

## ✨ What Makes This Special

| Feature | Description |
|---|---|
| 📊 **Real-Time Dashboard** | 5 tabs — Overview, Analytics, Customers, Risk Engine, AI Advisor — all live, dark/light mode |
| 🔮 **ML Risk Engine** | Scores every customer 0–100 from contract type, tenure, charges, internet service, senior status |
| 🤖 **Claude AI Advisor** | Optional — generates retention recommendations from live data. Runs in a clearly-labeled demo mode if no API key is set |
| 👥 **Customer Registry** | 940 customers — searchable, sortable, filterable, paginated, one-click CSV export |
| 📈 **5 Chart Types** | Contract, internet service, payment method, tenure buckets, monthly charges |
| ⚡ **9 REST API Endpoints** | Full OpenAPI 3.1 spec, no auth required |
| 🐍 **Python ML Model** | Standalone scikit-learn logistic regression, runs from the CLI |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/upendra8690/churnguard-customer-churn-prediction.git
cd churnguard-customer-churn-prediction
```

```bash
# 2. Start the backend (Terminal 1)
cd backend
npm install
npm run dev
# ✅ http://localhost:3001
```

```bash
# 3. Start the frontend (Terminal 2)
cd frontend
npm install
npm run dev
# ✅ http://localhost:5173
```

```bash
# 4. (Optional) Run the standalone Python model
pip install pandas scikit-learn
python churn_model.py
```

---

## 🛠️ How It Works


🖥️  React Dashboard
│
▼
📡  fetch('/api/churn/...')
│
▼
⚙️   Express Router ──► loads churnguard_data.csv once, caches in memory
│
▼
🧮  Risk Scoring Engine
├── Contract type   → Month-to-month = highest weight
├── Tenure           → ≤12 months = high risk
├── Monthly charges  → above-average = higher risk
├── Internet service → Fiber optic = elevated risk
└── Senior citizen   → adds risk weight
│
▼
🤖  /ai-advisor ──► ANTHROPIC_API_KEY set? → live Claude call
not set?             → labeled demo response
│
▼
📊  JSON response ──► Recharts renders live on the dashboard



---

## 🔌 API Reference

Base URL: `https://churnguard-customer-churn-prediction.onrender.com/api/churn`
Local: `http://localhost:3001/api/churn`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/summary` | Churn rate, avg charges, tenure, senior rate |
| `GET` | `/by-contract` | Churn counts by contract type |
| `GET` | `/by-internet` | Churn counts by internet service |
| `GET` | `/by-payment` | Churn counts by payment method |
| `GET` | `/tenure-distribution` | Churn across 6 tenure buckets |
| `GET` | `/monthly-charges` | Charges distribution |
| `GET` | `/customers` | All 940 customers with risk scores |
| `POST` | `/predict` | Predict churn from customer attributes |
| `POST` | `/ai-advisor` | AI retention recommendations (demo mode without a key) |

**Example:**
```bash
curl -X POST https://churnguard-customer-churn-prediction.onrender.com/api/churn/predict \
  -H "Content-Type: application/json" \
  -d '{"tenure":12,"monthlyCharges":70,"totalCharges":840,"seniorCitizen":0,"contract":0}'
```
```json
{"prediction":1,"churnProbability":62.5,"label":"Likely to Churn"}
```

---

## 🧠 Machine Learning Model


Algorithm : Logistic Regression (scikit-learn)
Accuracy  : ~68% on held-out test data
Dataset   : 940 telecom customers
Features  : tenure, MonthlyCharges, TotalCharges, SeniorCitizen, Contract
Split     : 80% train / 20% test, stratified


## 🏗 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 · TypeScript · Vite · Recharts · TanStack Query |
| Backend | Node.js 24 · Express · TypeScript · PapaParse |
| AI | Anthropic Claude API (optional, user-supplied key) |
| ML | Python · scikit-learn · pandas |
| Hosting | Vercel (frontend) · Render (backend) |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| Frontend loads but shows no data | Backend isn't running — start it first: `cd backend && npm run dev` |
| First API request takes ~40 seconds | Render free tier cold start after inactivity — normal |
| AI Advisor says "Demo mode" | Expected without a key — set `ANTHROPIC_API_KEY` in your Render environment variables for live AI |
| Refreshing `/dashboard` shows a blank/404 page (self-hosted forks) | Add a SPA rewrite so all routes serve `index.html` — see `frontend/vercel.json` |
| `npm run dev` fails on the backend | Uses `tsx`, not `ts-node` — run `npm install` first, then `npm run dev` |

---

## 🗺 Roadmap

- [x] Real-time dashboard, ML risk engine, AI advisor, 9 API endpoints — **live now**
- [ ] Slack / email churn alerts
- [ ] Salesforce / HubSpot integration
- [ ] Custom risk-model training UI

---

## 👨‍💻 Author

<div align="center">

**Mopuru Upendra Reddy**

[![GitHub](https://img.shields.io/badge/GitHub-upendra8690-181717?style=for-the-badge&logo=github)](https://github.com/upendra8690)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mopuru-upendra-reddy-374048303)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/Upendra_Reddy90)

*"Built solo — a full-stack ML project, deployed and open source."*

</div>

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com) — Claude API for the AI advisor
- [Recharts](https://recharts.org) & [TanStack Query](https://tanstack.com/query) — dashboard charts and data fetching
- [scikit-learn](https://scikit-learn.org) — the ML model

---

<div align="center">

⭐ **If this project is useful to you, a star helps other people find it.** ⭐

</div>