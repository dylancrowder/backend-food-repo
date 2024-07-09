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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const api = (0, supertest_1.default)(app_1.default);
describe("POST /api/createProduct", () => {
    it("should create a product and return it", () => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = {
            img: "sadsadsa",
            title: "pedro",
            parrafo: "asadd",
            price: 122,
            category: "sdsd",
        };
        // Make a POST request to create a new product
        const response = yield api
            .post("/api/createProduct")
            .send(newProduct)
            .expect(200)
            .expect("Content-Type", /json/);
        // Check that the response body matches expectations
        expect(response.body).toHaveProperty("title", "pedro"); // Adjusted to match the expected title
        expect(response.body).toHaveProperty("price", 122); // Adjusted to match the expected price
    }));
});
describe("POST /api/createProduct error", () => {
    it("should show the errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = {
            img: "sadsadsa",
            title: "pedro",
            parrafo: "asadd",
            category: "sdsd",
        };
        // Make a POST request to create a new product
        const response = yield api
            .post("/api/createProduct")
            .send(newProduct)
            .expect(400)
            .expect("Content-Type", /json/);
    }));
});
describe("GET /api/getAllProducts obtener products", () => {
    it("should show the errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .get("/api/getAllProducts")
            .expect(200)
            .expect("Content-Type", /json/);
        expect(response.body).not.toHaveLength(0);
    }));
});
describe("GET /api/getFour obtener cuatro products", () => {
    it("should show the errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .get("/api/getFour")
            .expect(200)
            .expect("Content-Type", /json/);
        expect(response.body).not.toHaveLength(5);
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app_1.default.disconnect();
}));
