"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoConect_1 = require("./db/mongoConect");
const middlewareError_1 = require("./errors/middlewareError");
const products_router_1 = __importDefault(require("./router/products.router"));
const cart_router_1 = __importDefault(require("./router/cart.router"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Cargar el archivo .env adecuado según el entorno
dotenv_1.default.config({
    path: process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development",
});
(0, mongoConect_1.initMongo)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Configurar body-parser antes de las sesiones
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configurar CORS para permitir el envío de cookies
// Configurar sesiones
app.use((0, express_session_1.default)({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.NODE_ENV === "production"
            ? process.env.DB_KEY
            : process.env.DB_KEY,
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
        secure: false,
    },
}));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true, // Permite el envío de cookies y cabeceras de autorización
}));
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = { id: Date.now() };
        console.log("Nueva sesión creada:", req.session.user.id);
    }
    else {
        console.log("Sesión existente:", req.session.user.id);
    }
    next();
});
app.get("/", (req, res) => {
    res.send("¡Bienvenido a mi aplicación en Vercel!");
});
app.use("/api", products_router_1.default);
app.use("/api/cart", cart_router_1.default);
app.use((0, morgan_1.default)("dev"));
app.use(middlewareError_1.errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
exports.default = app;
