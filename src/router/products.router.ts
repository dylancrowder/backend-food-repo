import express from "express";
import { ProductController } from "../controller/products.controller";

const router = express.Router();

/* create  */
router.post("/create", async (req, res, next) => {
  try {
    const body = req.body;
    const product = await ProductController.create(body);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

/* all */
router.get("/all", async (req, res, next) => {
  try {
    const products = await ProductController.all();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

/* four */
router.get("/four", async (req, res) => {
  const products = await ProductController.four();
  res.status(200).json(products);
});

/* category */
router.get("/category/:ctg", async (req, res, next) => {
  try {
    const { ctg } = req.params;
    const products = await ProductController.category(ctg);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

export default router;
