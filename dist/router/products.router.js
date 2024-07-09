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
const products_controller_1 = require("../controller/products.controller");
const router = express_1.default.Router();
/* create  */
router.post("/create", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const product = yield products_controller_1.ProductController.create(body);
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
}));
/* all */
router.get("/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_controller_1.ProductController.all();
        res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
}));
/* four */
router.get("/four", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield products_controller_1.ProductController.four();
    console.log(req.session);
    res.status(200).json(products);
}));
/* category */
router.get("/category/:ctg", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ctg } = req.params;
        const products = yield products_controller_1.ProductController.category(ctg);
        res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
