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

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://food-ecommerce-coral.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version"
  );
  next();
});

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
      httpOnly: true,
      secure: true,
      sameSite: "lax",
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
  console.log("esta es la session existente en el moment", req.session.user);

  if (!req.session.user) {
    req.session.user = { id: Date.now().toString() };
    console.log(
      "Nueva sesión creada:",
      req.session.user.id,
      "en el puersto",
      PORT
    );
  } else {
    console.log("Sesión existente:", req.session.user.id);
  }

  next();
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
