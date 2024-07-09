"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError {
    static create({ name = "Error", cause, message, code = 1, }) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;
        throw error;
    }
}
exports.CustomError = CustomError;
