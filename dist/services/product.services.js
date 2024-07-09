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
exports.ProductService = void 0;
const food_schema_1 = __importDefault(require("../db/schemas/food.schema"));
class ProductService {
    static create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const create = yield food_schema_1.default.create(body);
            return create;
        });
    }
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            const getALl = yield food_schema_1.default.find();
            console.log(getALl);
            return getALl;
        });
    }
    static four() {
        return __awaiter(this, void 0, void 0, function* () {
            const getFour = yield food_schema_1.default.find().limit(4);
            return getFour;
        });
    }
    static category(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield food_schema_1.default.find({ category });
            return products;
        });
    }
}
exports.ProductService = ProductService;
