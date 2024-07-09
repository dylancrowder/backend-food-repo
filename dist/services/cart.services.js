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
exports.CartService = void 0;
const cart_schema_1 = __importDefault(require("../db/schemas/cart.schema"));
const mongoose_1 = require("mongoose");
class CartService {
    static create(session, productID) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = {
                product: new mongoose_1.Types.ObjectId(productID),
                quantity: 1,
            };
            const create = yield cart_schema_1.default.create({ session, items: [newItem] });
            return create;
        });
    }
    static findOne(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield cart_schema_1.default.findOne({ session }).populate("items.product");
            return cart;
        });
    }
    static update(session, cart) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCart = yield cart_schema_1.default.findOneAndUpdate({ session }, cart, {
                new: true,
            });
            return updatedCart;
        });
    }
}
exports.CartService = CartService;
