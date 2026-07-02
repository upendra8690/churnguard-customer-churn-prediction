import { Router } from "express";
import churnRouter from "./churn.js";

export const router = Router();
router.use("/", churnRouter);