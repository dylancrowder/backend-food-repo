"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FoodSchema = new mongoose_1.default.Schema({
    img: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    parrafo: { type: String, require: true },
    price: { type: Number, require: true },
    category: { type: String, require: true },
});
const Food = mongoose_1.default.model("Food", FoodSchema);
exports.default = Food;
