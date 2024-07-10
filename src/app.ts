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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
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
  if (!req.session.user) {
    req.session.user = { id: Date.now().toString() };
    console.log("Nueva sesión creada:", req.session.user.id);
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
