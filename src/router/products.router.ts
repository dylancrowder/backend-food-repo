import express from "express";
import { ProductController } from "../controller/products.controller";

const router = express.Router();



/* four */
router.get("/four", async (req, res) => {
  const products = await ProductController.four();
  console.log(req.session);

  res.status(200).json(products);
});



export default router;
