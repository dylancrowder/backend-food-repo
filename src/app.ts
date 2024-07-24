import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { initMongo } from "./db/mongoConect";
import { errorHandlerMiddleware } from "./errors/middlewareError";
import productRouter from "./router/products.router";
import cartRouter from "./router/cart.router";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

import jwt from "jsonwebtoken";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

initMongo();

const app = express();
const PORT = process.env.PORT || 8080;
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS
app.use(
  cors({
    origin: "https://ecommerce-food-dylan.netlify.app",
    credentials: true,
  })
);

app.use((req: any, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://ecommerce-food-dylan.netlify.app"
  );
  const SECRET_KEY = "tu_clave_secreta";
  let token = req.cookies.token;
  console.log("este es el token", token);
  if (!token) {
    const uuid = uuidv4();
    const token: any = jwt.sign({ device: uuid }, SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    next();
  }
  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.device = decoded.device;
    next();
  });
});

app.get("/", (req: any, res) => {
  res.send({ message: "Hola Vercel como estas!!!!", device: req.device });
});

app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

app.use(morgan("dev"));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
