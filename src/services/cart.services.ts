import Cart from "../db/schemas/cart.schema";
import { Types } from "mongoose";

export class CartService {
  static async create(session: string, productID: string) {
    const newItem = {
      product: new Types.ObjectId(productID),
      quantity: 1,
    };

    const create = await Cart.create({ session, items: [newItem] });
    return create;
  }

  static async findOne(session: string) {
    const cart = await Cart.findOne({ session }).populate("items.product");
   
    
    return cart;
  }
  static async update(session: string, cart: any) {
    const updatedCart = await Cart.findOneAndUpdate({ session }, cart, {
      new: true,
    });
    return updatedCart;
  }
 
}
