import { ObjectId } from "mongodb";
export interface Food {
  img: string;
  title: string;
  parrafo: string;
  price: number;
  category: string;
}

export interface Item {
  productId: string;
  quantity: number;
  // Añade otras propiedades del producto según sea necesario
}

export interface Cart {
  _id: ObjectId | string;
  session: string;
  items: Item[];
}
