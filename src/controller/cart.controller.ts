import { ObjectId } from "mongodb";
import { CartService } from "../services/cart.services";
import Cart from "../db/schemas/cart.schema";
import { diferentProduct } from "../errors/causeError";
import { CustomError } from "../errors/customError";
import enumError from "../errors/enumError";

export class CartController { 

  static async buy(session: string, productID: string) {
    try {
      const cart: any = await CartService.findOne(session);

      if (!cart) {
        await CartService.create(session, productID);
        return;
      }

      const existingItemIndex = cart.items.findIndex((item: any) => {
        return item.product._id.toString() === productID.toString();
      });

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += 1;
      } else {
        cart.items.push({
          product: new ObjectId(productID),
          quantity: 1,
        });
      }

      await cart.save();
    } catch (error) {
      console.error(
        `Error al añadir el producto ${productID} al carrito:`,
        error
      );
      throw error;
    }
  }
  static async deleteOne(session: string, productID: string) {
    try {
      const cart: any = await CartService.findOne(session);

      // Encuentra el índice del producto en el carrito
      const deleteProductIndex = cart.items.some(
        (item: any, index: any) => cart.items.indexOf(item) !== index
      );

      // Si no se encuentra el producto, lanza un error
      if (deleteProductIndex === -1) {
        throw CustomError.create({
          name: "diferent_product",
          cause: diferentProduct(productID),
          message: "inexistent product in the cart",
          code: enumError.ITEM_NOT_FOUND,
        });
      }

      // Elimina el producto del array items
      cart.items.splice(deleteProductIndex, 1);

      // Actualiza el carrito en la base de datos
      const result: any = await Cart.updateOne(
        { session: session },
        { items: cart.items },
        { quantity: -1 }
      );

      if (result.nModified === 0) {
        throw new Error("Failed to update cart");
      }

      return result;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  static async deleteOneQuantity(session: string, productID: string) {
    try {
      const cart: any = await CartService.findOne(session);

      if (!cart) {
        throw new Error("Cart not found");
      }

      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.product._id.toString() === productID.toString()
      );

      if (existingItemIndex === -1) {
        throw new Error("Product not found in cart");
      }

      if (cart.items[existingItemIndex].quantity > 1) {
        cart.items[existingItemIndex].quantity -= 1;
      } else {
        cart.items.splice(existingItemIndex, 1);
      }

      await cart.save();
    } catch (error: any) {
      console.error(
        `Error al disminuir la cantidad del producto ${productID} en el carrito:`,
        error
      );
      throw error;
    }
  }

  static async addOneQuantity(session: string, productID: string) {
    try {
      const cart: any = await CartService.findOne(session);

      if (!cart) {
        throw new Error("Cart not found");
      }

      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.product._id.toString() === productID.toString()
      );

      if (existingItemIndex === -1) {
        throw new Error("Product not found in cart");
      }

      cart.items[existingItemIndex].quantity += 1;

      await cart.save();
    } catch (error: any) {
      console.error(
        `Error al aumentar la cantidad del producto ${productID} en el carrito:`,
        error
      );
      throw error;
    }
  }
}
