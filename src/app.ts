import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { authRoutes } from "./routes/authRoutes";

dotenv.config(); //to use env
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.static("public")); //for file upload
app.use(morgan("dev")); //http middleware
app.use(express.urlencoded({ extended: false }));

// Middleware for parsing JSON bodies
app.use(bodyParser.json());
app.use(cookieParser());

server.listen(8080, () => {
  console.log("server connected");
});
app.use("/auth", authRoutes);
