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
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

initMongo();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 8080;
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://food-ecommerce-coral.vercel.app",
    ],
    credentials: true,
  })
);

app.use((req: any, res, next) => {
  const SECRET_KEY = "tu_clave_secreta";
  let token = req.cookies.token;

  if (!token) {
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

app.get("/", (req: any, res) => {
  res.send({ message: "Hola Vercel !!!", device: req.device });
});

app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

app.use(morgan("dev"));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
