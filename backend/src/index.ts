import express from "express";
import cors from "cors";
import { router as churnRouter } from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/churn", churnRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});