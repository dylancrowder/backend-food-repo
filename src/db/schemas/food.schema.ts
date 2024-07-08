import mongoose from "mongoose";
import { Food } from "../../interface/interface";

const FoodSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  parrafo: { type: String, require: true },
  price: { type: Number, require: true },
  category: { type: String, require: true },
});

const Food = mongoose.model<Food>("Food", FoodSchema);

export default Food;
