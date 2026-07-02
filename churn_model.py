import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# ---------------------------
# Load and clean dataset
# ---------------------------
df = pd.read_csv("churnguard_data.csv")

if "customerID" in df.columns:
    df = df.drop("customerID", axis=1)

df = df.drop_duplicates()

text_cols = ["gender", "PaymentMethod", "Churn", "PhoneService", "PaperlessBilling"]
for col in text_cols:
    if col in df.columns:
        df[col] = df[col].astype(str).str.strip()

if "Churn" in df.columns:
    df["Churn"] = df["Churn"].str.title()
if "PhoneService" in df.columns:
    df["PhoneService"] = df["PhoneService"].str.title()
if "PaperlessBilling" in df.columns:
    df["PaperlessBilling"] = df["PaperlessBilling"].str.title()

if "Contract" in df.columns:
    contract_map = {
        "Monthly": "Month-to-month",
        "month to month": "Month-to-month",
        "Month-to-month": "Month-to-month",
        "1 year": "One year",
        "2 year": "Two year"
    }
    df["Contract"] = df["Contract"].replace(contract_map)

for col in ["MonthlyCharges", "TotalCharges", "tenure"]:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

if "MonthlyCharges" in df.columns:
    df["MonthlyCharges"] = df["MonthlyCharges"].fillna(df["MonthlyCharges"].mean())
if "TotalCharges" in df.columns:
    df["TotalCharges"] = df["TotalCharges"].fillna(df["TotalCharges"].mean())
if "tenure" in df.columns:
    df["tenure"] = df["tenure"].fillna(df["tenure"].median())

df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})
df["Contract"] = df["Contract"].map({
    "Month-to-month": 0,
    "One year": 1,
    "Two year": 2
})

df = df.dropna()

# ---------------------------
# Features and target
# ---------------------------
X = df[["tenure", "MonthlyCharges", "TotalCharges", "SeniorCitizen", "Contract"]]
y = df["Churn"]

# ---------------------------
# Train/test split for real evaluation
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# ---------------------------
# Evaluate model
# ---------------------------
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print("=" * 50)
print("MODEL PERFORMANCE")
print("=" * 50)
print(f"Accuracy on test data: {acc * 100:.2f}%")
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Stay", "Churn"]))
print("=" * 50)

# ---------------------------
# User Input for live prediction
# ---------------------------
print("\nPredict a new customer:")
tenure = int(input("Enter tenure (months): "))
monthly = float(input("Enter Monthly Charges: "))
total = float(input("Enter Total Charges: "))
senior = int(input("Senior Citizen? (1 = Yes, 0 = No): "))
contract = int(input("Contract type (0 = Month-to-month, 1 = One year, 2 = Two year): "))

user_data = pd.DataFrame({
    "tenure": [tenure],
    "MonthlyCharges": [monthly],
    "TotalCharges": [total],
    "SeniorCitizen": [senior],
    "Contract": [contract]
})

prediction = model.predict(user_data)[0]
probability = model.predict_proba(user_data)[0][1]

print("\n" + "=" * 50)
if prediction == 1:
    print(f"Prediction: This customer is likely to CHURN.")
else:
    print(f"Prediction: This customer is likely to STAY.")
print(f"Churn probability: {probability * 100:.1f}%")
print("=" * 50)