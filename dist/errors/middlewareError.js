"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const enumError_1 = __importDefault(require("./enumError"));
const errorHandlerMiddleware = (error, req, res, next) => {
    /* console.error(error.cause || error.message); */
    switch (error.code) {
        case enumError_1.default.BAD_REQUEST_ERROR:
        case enumError_1.default.INVALID_PARAMS_ERROR:
        case enumError_1.default.EMPTY_QUERY:
            res.status(400).json({ status: "error", message: error.message });
            break;
        case enumError_1.default.DATA_BASE_ERROR:
        case enumError_1.default.ROUTING_ERROR:
        default:
            res.status(500).json({ status: "error", message: error.message });
    }
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
