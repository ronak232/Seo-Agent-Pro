import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { route } from "./routes/route";
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = ["http://localhost:5173", "https://ronak232.github.io"];
const app = express();
const server = createServer(app);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", route);

server.listen(process.env.PORT || "5000", () => {
  console.log("app running on port 5000");
});
