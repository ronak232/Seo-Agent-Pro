import express from "express";
import { agent } from "../controller/agentController";
import { blogAnalysis } from "../controller/blogAnalysisController";
export const route = express.Router();

route.post("/api/v1/upload", agent);
route.post("/api/v1/analyze", blogAnalysis);
