import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { initMongo } from "./db/mongoConect";
import { errorHandlerMiddleware } from "./errors/middlewareError";

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

initMongo();

const app = express();
app.use(compression());

const PORT = 8080;
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS
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

app.get("/token", (req, res) => {
  const uuid = uuidv4();
  const newToken = jwt.sign({ device: uuid }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "30d",
  });

  res.json({ token: newToken });
});

app.use(morgan("dev"));
app.use("/api", productRouter);
app.use("/api/cart", verifyToken, cartRouter);
app.use("/payment", payment);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
