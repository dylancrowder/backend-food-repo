import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { initMongo } from "./db/mongoConect";
import { errorHandlerMiddleware } from "./errors/middlewareError";
import productRouter from "./router/products.router";
import cartRouter from "./router/cart.router";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

// Cargar el archivo .env adecuado según el entorno
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

initMongo();

const app = express();

const PORT = process.env.PORT || 8080;

// Configurar body-parser antes de las sesiones
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir el envío de cookies

// Configurar sesiones
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.NODE_ENV === "production"
          ? process.env.DB_KEY
          : process.env.DB_KEY,
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
      secure: false,
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true, // Permite el envío de cookies y cabeceras de autorización
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    console.log("esta es la session actual", req.cookies, req.sessionID);

    req.session.user = { id: Date.now() };
    console.log("Nueva sesión creada:", req.session.user.id);
  } else {
    console.log("Sesión existente:", req.session.user.id);
  }

  next();
});

app.use("/api", productRouter);
app.use("/api/cart", cartRouter);
app.get("/", (req, res) => {
  res.send("funciona");
});
app.use(morgan("dev"));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
