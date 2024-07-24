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
const SECRET_KEY = "tu_clave_secreta";

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
app.get("/", (req, res) => {
  const uuid = uuidv4();
  const newToken = jwt.sign({ device: uuid }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "30d",
  });

  res.json({ token: newToken });
});
app.use((req: any, res, next) => {
  const SECRET_KEY = "tu_clave_secreta";
  let token = req.cookies.token;

  const token = req.headers.authorization?.split(" ")[1];
  console.log("este es el token", token);

  if (!token) {
    return res.status(403).send("No token provided");
  }

    const uuid = uuidv4();
    token = jwt.sign({ device: uuid }, SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // usar secure solo en producción
      sameSite: "strict", // asegura que la cookie solo sea enviada en solicitudes de primer partido
    });

    // Redirige al cliente para que obtenga la cookie en la siguiente solicitud
    res.redirect(req.originalUrl);
    return;
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    req.device = decoded.device;
    next();
  });
});

app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

app.use(morgan("dev"));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
