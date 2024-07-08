import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  session: { type: String },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
