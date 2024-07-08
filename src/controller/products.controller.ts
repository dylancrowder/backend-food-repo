import { createProductError, errorGetData } from "../errors/causeError";
import { CustomError } from "../errors/customError";
import enumError from "../errors/enumError";
import { Food } from "../interface/interface";
import { ProductService } from "../services/product.services";

export class ProductController {
  static async create(body: Food) {
    try {
      if (
        !body.img ||
        !body.category ||
        !body.parrafo ||
        !body.price ||
        !body.title
      ) {
        throw CustomError.create({
          name: "bad_params",
          cause: createProductError(body),
          message: "faltan parametros.",
          code: enumError.INVALID_PARAMS_ERROR,
        });
      }

      const create = await ProductService.create(body);
      return create;
    } catch (error) {
      throw error;
    }
  }

  static async all() {
    try {
      const products = await ProductService.all();
      if (!products) {
        throw CustomError.create({
          name: "empty data",
          cause: errorGetData(),
          message: "no data avaylable",
          code: enumError.BAD_REQUEST_ERROR,
        });
      }
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async four() {
    try {
      const products = await ProductService.four();
      if (!products) {
        throw CustomError.create({
          name: "empty data",
          cause: errorGetData(),
          message: "no data avaylable",
          code: enumError.BAD_REQUEST_ERROR,
        });
      }
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async category(ctg: string) {
    try {

      
      if (ctg === "All") {
        const products = await ProductService.all();
        return products;
      }
      const products = await ProductService.category(ctg);
      if (!products || !ctg) {
        throw CustomError.create({
          name: "no category",
          cause: errorGetData(),
          message: "error query or dont exist category",
          code: enumError.INVALID_PARAMS_ERROR,
        });
      }

      return products;
    } catch (error) {
      throw error;
    }
  }
}
