import express from "express";
import { CartController } from "../controller/cart.controller";


const router = express.Router();



/* add one product */
router.post("/increment/:productID", async (req, res, next) => {
  try {
    const { productID } = req.params;
    const session = req.session?.user?.id.toString();

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await CartController.addOneQuantity(session, productID);

    res
      .status(200)
      .json({ message: "Cantidad de producto aumentada en el carrito" });
  } catch (error) {
    next(error);
  }
});
export default router;
