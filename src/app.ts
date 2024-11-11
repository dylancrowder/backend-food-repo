// app.ts
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pinoHttp from "pino-http";
import helmet from "helmet";

import { initMongo } from "./db/mongoConect";

import productRouter from "./router/products.router";
import cartRouter from "./router/cart.router";
import payment from "./router/payment.router";

import { verifyToken } from "./middlewares/middlewares";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

// Inicialización de la base de datos MongoDB
initMongo();

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(pinoHttp());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sandbox.mercadopago.com.ar",
      "https://www.mercadopago.com.ar",
      "https://tournament-sent-nebraska-alpine.trycloudflare.com",
      "https://ecommerce-food-dylan.netlify.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const SECRET_KEY = "PALOMA";

// Ruta para generar un token
app.get("/token", (req, res) => {
  const uuid = uuidv4();
  const newToken = jwt.sign({ device: uuid }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "30d",
  });

  res.json({ token: newToken });
});

// Rutas de la aplicación
app.use("/api", productRouter);
app.use("/api/cart", verifyToken, cartRouter);
app.use("/payment", payment);

// Middleware de manejo de errores


export default app;
