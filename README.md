# 🛡️ ChurnGuard — Customer Churn Prediction Platform

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3b82f6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-22c55e?style=flat-square&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)
![Stars](https://img.shields.io/github/stars/upendra8690/churnguard-customer-churn-prediction?style=flat-square&color=FFD700)

> Stop losing customers. Start predicting churn.

A full-stack churn prediction platform — a React dashboard, an Express API, a weighted risk-scoring engine, an optional Claude AI advisor, and a standalone Python scikit-learn model. Built solo by **Mopuru Upendra Reddy**.

## 🚀 Live Demo

- **Website:** https://churnguard-customer-churn-predictio.vercel.app
- **Dashboard:** https://churnguard-customer-churn-predictio.vercel.app/dashboard
- **Backend API:** https://churnguard-customer-churn-prediction.onrender.com/api/churn/summary

> Backend is on Render's free tier — first request after inactivity takes 30-50s to wake up.

## 🌍 Overview

ChurnGuard predicts which customers are likely to cancel, using a weighted risk score (0-100) built from contract type, tenure, monthly charges, internet service, and senior-citizen status. It includes a real-time analytics dashboard, a searchable customer registry, and an optional AI advisor that turns the live data into plain-English retention recommendations.

## ✨ Features

| Feature | Description |
|---|---|
| 📊 Real-Time Dashboard | Live churn KPIs, 5 chart types, dark/light mode |
| 🔮 ML Risk Engine | Scores every customer 0–100 |
| 🤖 Claude AI Advisor | Optional — needs your own API key, runs in demo mode without one |
| 👥 Customer Registry | 940 customers — searchable, sortable, filterable, exportable |
| ⚡ 9 REST API Endpoints | Full OpenAPI 3.1 spec |
| 🐍 Python ML Model | scikit-learn logistic regression, ~68% test accuracy |

## 🚀 Quick Start (run it locally)

**Prerequisites:** Node.js 18+, Python 3.10+

```bash
git clone https://github.com/upendra8690/churnguard-customer-churn-prediction.git
cd churnguard-customer-churn-prediction
```

**Backend** (Terminal 1):
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:3001`

**Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`

**Python ML model** (optional):
```bash
pip install pandas scikit-learn
python churn_model.py
```

## 📁 Project Structure

churnguard-customer-churn-prediction/
├── frontend/              React 18 + TypeScript + Vite dashboard + landing page
├── backend/                Node.js + Express API
├── api-spec/openapi.yaml   Full API contract
├── churn_model.py          Python scikit-learn model (CLI)
├── churnguard_data.csv     940-row telecom dataset
├── requirements.txt        Python dependencies
└── README.md

## 🔌 API Reference

Base URL: `https://churnguard-customer-churn-prediction.onrender.com/api/churn`
(locally: `http://localhost:3001/api/churn`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/summary` | Churn rate, avg charges, tenure, senior rate |
| GET | `/by-contract` | Churn counts by contract type |
| GET | `/by-internet` | Churn counts by internet service |
| GET | `/by-payment` | Churn counts by payment method |
| GET | `/tenure-distribution` | Churn across 6 tenure buckets |
| GET | `/monthly-charges` | Charges distribution |
| GET | `/customers` | All customers with risk scores |
| POST | `/predict` | Predict churn from customer attributes |
| POST | `/ai-advisor` | AI retention recommendations (demo mode without an API key) |

**Example:**
```bash
curl -X POST https://churnguard-customer-churn-prediction.onrender.com/api/churn/predict \
  -H "Content-Type: application/json" \
  -d '{"tenure":12,"monthlyCharges":70,"totalCharges":840,"seniorCitizen":0,"contract":0}'
```
```json
{"prediction":1,"churnProbability":62.5,"label":"Likely to Churn"}
```

## 🧠 ML Model

Algorithm : Logistic Regression (scikit-learn)
Accuracy  : ~68% on held-out test data
Dataset   : 940 telecom customers
Features  : tenure, MonthlyCharges, TotalCharges, SeniorCitizen, Contract


## 🏗 Tech Stack

React 18 · TypeScript · Vite · Recharts · TanStack Query · Node.js · Express · Anthropic Claude API (optional) · Python · scikit-learn · pandas

## 🗺 Roadmap

- [x] Real-time dashboard, ML risk engine, AI advisor, 9 API endpoints — live now
- [ ] Slack/email churn alerts
- [ ] Salesforce/HubSpot integration
- [ ] Custom risk model training UI

## 📜 License

MIT — free to use, modify, and distribute.

## 👨‍💻 Author

**Mopuru Upendra Reddy** — [GitHub](https://github.com/upendra8690) · [LinkedIn](https://www.linkedin.com/in/mopuru-upendra-reddy-374048303) · [Twitter/X](https://x.com/Upendra_Reddy90)