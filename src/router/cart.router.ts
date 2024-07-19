import express from "express";
import { CartController } from "../controller/cart.controller";
import { CartService } from "../services/cart.services";

const router = express.Router();

/* create  */
router.post("/create", async (req, res, next) => {
  try {
    const { productID } = req.body;
    const sessionI: any = req.session.user?.id.toString();

    const product = await CartController.buy(sessionI, productID);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

//find



router.get("/find", async (req, res, next) => {
  try {
    const cartID: string = req.session?.user?.id.toString();
    const cart = await CartService.findOne(cartID);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});
/* delete all products */
router.delete("/delete/:productID", async (req, res, next) => {
  try {
    const { productID } = req.params;
    const session = req.session?.user?.id.toString();

    const deleteProduct = await CartController.deleteOne(session, productID);

    res.status(200).json(deleteProduct);
  } catch (error) {
    next(error);
  }
});

/* delete one product */
router.delete("/decrement/:productID", async (req, res, next) => {
  try {
    const { productID } = req.params;
    const session = req.session?.user?.id.toString();

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await CartController.deleteOneQuantity(session, productID);

    res
      .status(200)
      .json({ message: "Cantidad de producto disminuida en el carrito" });
  } catch (error) {
    next(error);
  }
});
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
