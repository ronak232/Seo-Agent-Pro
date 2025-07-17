import express from "express";
import { agent } from "../controller/agentController";

export const route = express.Router();

route.post("/api/v1/upload", agent);