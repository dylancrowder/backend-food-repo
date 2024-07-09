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
exports.CartController = void 0;
const mongodb_1 = require("mongodb"); // Asumiendo que estás usando MongoDB ObjectId
const cart_services_1 = require("../services/cart.services");
const cart_schema_1 = __importDefault(require("../db/schemas/cart.schema"));
const causeError_1 = require("../errors/causeError");
const customError_1 = require("../errors/customError");
const enumError_1 = __importDefault(require("../errors/enumError"));
class CartController {
    static buy(session, productID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield cart_services_1.CartService.findOne(session);
                if (!cart) {
                    yield cart_services_1.CartService.create(session, productID);
                    return;
                }
                // Buscamos si el producto ya está en el carrito
                const existingItemIndex = cart.items.findIndex((item) => {
                    return item.product._id.toString() === productID.toString();
                });
                if (existingItemIndex !== -1) {
                    cart.items[existingItemIndex].quantity += 1;
                }
                else {
                    cart.items.push({
                        product: new mongodb_1.ObjectId(productID),
                        quantity: 1,
                    });
                }
                yield cart.save();
                console.log(`Producto ${productID} añadido al carrito correctamente.`);
            }
            catch (error) {
                console.error(`Error al añadir el producto ${productID} al carrito:`, error);
                throw error;
            }
        });
    }
    static deleteOne(session, productID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield cart_services_1.CartService.findOne(session);
                // Encuentra el índice del producto en el carrito
                const deleteProductIndex = cart.items.some((item, index) => cart.items.indexOf(item) !== index);
                console.log(deleteProductIndex);
                // Si no se encuentra el producto, lanza un error
                if (deleteProductIndex === -1) {
                    throw customError_1.CustomError.create({
                        name: "diferent_product",
                        cause: (0, causeError_1.diferentProduct)(productID),
                        message: "inexistent product in the cart",
                        code: enumError_1.default.ITEM_NOT_FOUND,
                    });
                }
                // Elimina el producto del array items
                cart.items.splice(deleteProductIndex, 1);
                // Actualiza el carrito en la base de datos
                const result = yield cart_schema_1.default.updateOne({ session: session }, { items: cart.items }, { quantity: -1 });
                if (result.nModified === 0) {
                    throw new Error("Failed to update cart");
                }
                console.log("Producto eliminado, resultado:", result);
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    static deleteOneQuantity(session, productID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield cart_services_1.CartService.findOne(session);
                if (!cart) {
                    throw new Error("Cart not found");
                }
                const existingItemIndex = cart.items.findIndex((item) => item.product._id.toString() === productID.toString());
                if (existingItemIndex === -1) {
                    throw new Error("Product not found in cart");
                }
                if (cart.items[existingItemIndex].quantity > 1) {
                    cart.items[existingItemIndex].quantity -= 1;
                }
                else {
                    cart.items.splice(existingItemIndex, 1);
                }
                yield cart.save();
                console.log(`Cantidad de producto ${productID} disminuida en el carrito correctamente.`);
            }
            catch (error) {
                console.error(`Error al disminuir la cantidad del producto ${productID} en el carrito:`, error);
                throw error;
            }
        });
    }
    // Añadir una cantidad de un producto al carrito
    static addOneQuantity(session, productID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cart = yield cart_services_1.CartService.findOne(session);
                if (!cart) {
                    throw new Error("Cart not found");
                }
                const existingItemIndex = cart.items.findIndex((item) => item.product._id.toString() === productID.toString());
                if (existingItemIndex === -1) {
                    throw new Error("Product not found in cart");
                }
                cart.items[existingItemIndex].quantity += 1;
                yield cart.save();
                console.log(`Cantidad de producto ${productID} aumentada en el carrito correctamente.`);
            }
            catch (error) {
                console.error(`Error al aumentar la cantidad del producto ${productID} en el carrito:`, error);
                throw error;
            }
        });
    }
}
exports.CartController = CartController;
