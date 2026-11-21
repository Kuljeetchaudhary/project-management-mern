import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser())
import allroutes from "./Routes/register.route.js"
import healthCheckRoute from "./Routes/healthCheck.routes.js"
import userRegistrationRoute from "./Routes/register.route.js";
import userLogginRouter from "./Routes/register.route.js"
import userLogoutRoute from "./Routes/register.route.js"

app.use("/api/v1/healthcheck", healthCheckRoute.router)
app.use("/api/v1/auth", userRegistrationRoute.router)
app.use("/api/v1/auth",userLogginRouter.router)
app.use("/api/v1/auth", userLogoutRoute.router)
app.use("/", allroutes.router)

app.get("/", (req, res) => {
  res.status(200).send("App is working fine");
});

export default app;
