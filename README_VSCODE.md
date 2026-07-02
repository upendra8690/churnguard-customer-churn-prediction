---

## 🔌 API Reference

`Base URL: http://localhost:3001/api/churn`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/summary` | KPIs: churn rate, charges, tenure |
| `GET` | `/by-contract` | Churn by contract type |
| `GET` | `/by-internet` | Churn by internet service |
| `GET` | `/by-payment` | Churn by payment method |
| `GET` | `/tenure-distribution` | 6 tenure buckets |
| `GET` | `/monthly-charges` | Charges distribution |
| `GET` | `/customers` | All 940 customers + risk scores |
| `POST` | `/predict` | Predict churn probability |

### Predict Example
```bash
curl -X POST http://localhost:3001/api/churn/predict \
  -H "Content-Type: application/json" \
  -d '{"tenure":12,"monthlyCharges":70,"totalCharges":840,"seniorCitizen":0,"contract":0}'
```
```json
{"prediction":1,"churnProbability":62.5,"label":"Likely to Churn"}
```

---

## 🧠 ML Model