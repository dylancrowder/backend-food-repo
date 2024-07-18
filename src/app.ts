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

initMongo(); // Inicializar conexión a MongoDB

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
      secure: true,
      sameSite: "none", // Para permitir cookies de terceros
    },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://devdylancrowder:dilan_07@cluster0.pbvemm9.mongodb.net/",
      ttl: 7 * 24 * 60 * 60, // Tiempo de vida máximo en segundos (opcional)
      autoRemove: "native", // Para limpiar automáticamente las sesiones expiradas (opcional)
    }),
  })
);

// CORS
app.use(
  cors({
    origin: "https://ecommerce-food-dylan.netlify.app",
    credentials: true,
  })
);

// En algún lugar antes de donde estás usando req.session.user
declare module "express-session" {
  interface SessionData {
    user: {
      id: any;
    };
  }
}

// Middleware para gestionar sesiones
app.use((req, res, next) => {
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

// Ruta de inicio
app.get("/", (req, res) => {
  const mode = process.env.NODE_ENV;
  res.send(`Hola Vercel! Modo: ${mode}`);
});

// Rutas de API
app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

// Middleware de registro de solicitudes
app.use(morgan("dev"));

// Middleware de manejo de errores
app.use(errorHandlerMiddleware);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
