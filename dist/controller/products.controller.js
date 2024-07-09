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
exports.ProductController = void 0;
const causeError_1 = require("../errors/causeError");
const customError_1 = require("../errors/customError");
const enumError_1 = __importDefault(require("../errors/enumError"));
const product_services_1 = require("../services/product.services");
class ProductController {
    static create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!body.img ||
                    !body.category ||
                    !body.parrafo ||
                    !body.price ||
                    !body.title) {
                    throw customError_1.CustomError.create({
                        name: "bad_params",
                        cause: (0, causeError_1.createProductError)(body),
                        message: "faltan parametros.",
                        code: enumError_1.default.INVALID_PARAMS_ERROR,
                    });
                }
                const create = yield product_services_1.ProductService.create(body);
                return create;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield product_services_1.ProductService.all();
                if (!products) {
                    throw customError_1.CustomError.create({
                        name: "empty data",
                        cause: (0, causeError_1.errorGetData)(),
                        message: "no data avaylable",
                        code: enumError_1.default.BAD_REQUEST_ERROR,
                    });
                }
                return products;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static four() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield product_services_1.ProductService.four();
                if (!products) {
                    throw customError_1.CustomError.create({
                        name: "empty data",
                        cause: (0, causeError_1.errorGetData)(),
                        message: "no data avaylable",
                        code: enumError_1.default.BAD_REQUEST_ERROR,
                    });
                }
                return products;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static category(ctg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (ctg === "All") {
                    const products = yield product_services_1.ProductService.all();
                    return products;
                }
                const products = yield product_services_1.ProductService.category(ctg);
                if (!products || !ctg) {
                    throw customError_1.CustomError.create({
                        name: "no category",
                        cause: (0, causeError_1.errorGetData)(),
                        message: "error query or dont exist category",
                        code: enumError_1.default.INVALID_PARAMS_ERROR,
                    });
                }
                return products;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ProductController = ProductController;
