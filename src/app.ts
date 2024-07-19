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
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Date",
      "X-Api-Version",
    ],
  })
);

// Configurar sesiones
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_KEY,
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

declare module "express-session" {
  interface SessionData {
    user: {
      id: any;
    };
  }
}

app.use((req, res, next) => {
  console.log(
    "esta es la session existente en el moment  y mi key de mg",
    req.session.user
  );

  if (!req.session.user) {
    req.session.user = { id: Date.now().toString() };
    console.log(
      "Nueva sesión creada:",
      req.session.user.id,
      "en el puerto",
      PORT
    );
  } else {
    console.log("Sesión existente:", req.session.user.id);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi aplicación en Vercel!");
});

app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

app.use(morgan("dev"));

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
