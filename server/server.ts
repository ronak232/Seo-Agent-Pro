import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { route } from "./routes/route";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", route);

server.listen("5000", () => {
  console.log("app running on port 5000");
});
