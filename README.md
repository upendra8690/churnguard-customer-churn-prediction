\# 🛡️ ChurnGuard — Customer Churn Prediction Platform



!\[React](https://img.shields.io/badge/React-18-61dafb?style=flat-square\&logo=react\&logoColor=white)

!\[TypeScript](https://img.shields.io/badge/TypeScript-5.0-3b82f6?style=flat-square\&logo=typescript\&logoColor=white)

!\[Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square\&logo=python\&logoColor=white)

!\[Node.js](https://img.shields.io/badge/Node.js-24-22c55e?style=flat-square\&logo=node.js\&logoColor=white)

!\[License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

!\[Stars](https://img.shields.io/github/stars/upendra8690/churnguard-customer-churn-prediction?style=flat-square\&color=FFD700)



A full-stack churn prediction platform: a React dashboard, an Express API, a weighted risk-scoring engine, an optional Claude AI advisor, and a standalone Python scikit-learn model — built as a personal project by \*\*Mopuru Upendra Reddy\*\*.



\*\*🔗 Live demo:\*\* \_(added here once deployed — see Part 3/4 below)\_



\## ✨ Features

| Feature | Description |

|---|---|

| 📊 Real-Time Dashboard | Live churn KPIs, animated counters, dark/light mode |

| 🔮 ML Risk Engine | Scores every customer 0–100 from contract, tenure, charges, etc. |

| 🤖 Claude AI Advisor | Optional — generates retention recommendations (needs your own API key; runs in demo mode without one) |

| 👥 Customer Registry | 940+ customers — searchable, sortable, filterable, exportable |

| 📈 5 Chart Types | Contract, internet, payment, tenure, monthly charges |

| ⚡ 8 REST API Endpoints | Full OpenAPI 3.1 spec |

| 🐍 Python ML Model | scikit-learn logistic regression, \~68% test accuracy |



\## 🚀 Quick Start (local)



\*\*Prerequisites:\*\* Node.js 18+, Python 3.10+



```bash

git clone https://github.com/upendra8690/churnguard-customer-churn-prediction.git

cd churnguard-customer-churn-prediction

```



\*\*Backend\*\* (Terminal 1):

```bash

cd backend

npm install

npm run dev

```

Runs on `http://localhost:3001`



\*\*Frontend\*\* (Terminal 2):

```bash

cd frontend

npm install

npm run dev

```

Open `http://localhost:5173`



\*\*Python ML model\*\* (optional):

```bash

pip install pandas scikit-learn

python churn\_model.py

```



\## 📁 Project Structure

