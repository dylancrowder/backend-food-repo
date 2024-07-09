"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controller/cart.controller");
const cart_services_1 = require("../services/cart.services");
const router = express_1.default.Router();
/* create  */
router.post("/create", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productID } = req.body;
        const sessionI = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id.toString();
        const product = yield cart_controller_1.CartController.buy(sessionI, productID);
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
}));
//find
router.get("/find", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const cartID = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id.toString();
        const cart = yield cart_services_1.CartService.findOne(cartID);
        res.status(200).json(cart);
    }
    catch (error) {
        next(error);
    }
}));
/* delete all products */
router.delete("/delete/:productID", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productID } = req.params;
        const session = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id.toString();
        const deleteProduct = yield cart_controller_1.CartController.deleteOne(session, productID);
        res.status(200).json(deleteProduct);
    }
    catch (error) {
        next(error);
    }
}));
/* delete one product */
router.delete("/decrement/:productID", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productID } = req.params;
        const session = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id.toString();
        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        yield cart_controller_1.CartController.deleteOneQuantity(session, productID);
        res
            .status(200)
            .json({ message: "Cantidad de producto disminuida en el carrito" });
    }
    catch (error) {
        next(error);
    }
}));
/* add one product */
router.post("/increment/:productID", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productID } = req.params;
        const session = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id.toString();
        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        yield cart_controller_1.CartController.addOneQuantity(session, productID);
        res
            .status(200)
            .json({ message: "Cantidad de producto aumentada en el carrito" });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
