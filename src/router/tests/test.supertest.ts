import supertest from "supertest";
import app from "../../app";

const api = supertest(app);

declare module "express-serve-static-core" {
  interface Express {
    disconnect: () => Promise<void>;
  }
}
describe("POST /api/createProduct", () => {
  it("should create a product and return it", async () => {
    const newProduct = {
      img: "sadsadsa",
      title: "pedro",
      parrafo: "asadd",
      price: 122,
      category: "sdsd",
    };

    // Make a POST request to create a new product
    const response = await api
      .post("/api/createProduct")
      .send(newProduct)
      .expect(200)
      .expect("Content-Type", /json/);

    // Check that the response body matches expectations
    expect(response.body).toHaveProperty("title", "pedro"); // Adjusted to match the expected title
    expect(response.body).toHaveProperty("price", 122); // Adjusted to match the expected price
  });
});

describe("POST /api/createProduct error", () => {
  it("should show the errors", async () => {
    const newProduct = {
      img: "sadsadsa",
      title: "pedro",
      parrafo: "asadd",
      category: "sdsd",
    };

    // Make a POST request to create a new product
    const response = await api
      .post("/api/createProduct")
      .send(newProduct)
      .expect(400)
      .expect("Content-Type", /json/);
  });
});

describe("GET /api/getAllProducts obtener products", () => {
  it("should show the errors", async () => {
    const response = await api
      .get("/api/getAllProducts")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).not.toHaveLength(0);
  });
});

describe("GET /api/getFour obtener cuatro products", () => {
  it("should show the errors", async () => {
    const response = await api
      .get("/api/getFour")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).not.toHaveLength(5);
  });
});

afterAll(async () => {
  await app.disconnect();
});
