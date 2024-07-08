import foodSchema from "../db/schemas/food.schema";
import { Food } from "../interface/interface";

export class ProductService {
  static async create(body: Food) {
    const create = await foodSchema.create(body);
    return create;
  }

  static async all() {
    const getALl = await foodSchema.find();
    console.log(getALl);

    return getALl;
  }
  static async four() {
    const getFour = await foodSchema.find().limit(4);
    return getFour;
  }
  static async category(category: any) {
    const products = await foodSchema.find({ category });
    return products;
  }
}
