"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diferentProduct = exports.errorGetData = exports.generatorErrorQuery = exports.generatorUserIdError = exports.createProductError = exports.generatorUserError = void 0;
const generatorUserError = (data) => {
    return `Todos los campos son requeridos y deben ser validos 😱.
        Lista de campos recibidos en la solicitud:
        - first_name  : ${data.first_name}
        - last_name   : ${data.last_name}
        - email       : ${data.email}
        - age         : ${data.age}
        `;
};
exports.generatorUserError = generatorUserError;
const createProductError = (data) => {
    return `Todos los campos son requeridos y deben ser validos 😱.
    Lista de campos recibidos en la solicitud:
    - imagen        : ${data.img}
    - titulo        : ${data.title}
    - parrafo       : ${data.parrafo}
    - precio        : ${data.price}
    - categoria     : ${data.category}
    `;
};
exports.createProductError = createProductError;
const generatorUserIdError = (id) => {
    return `Se debe enviar un identificador valido 😱.
        Valor recibido: ${id}
      `;
};
exports.generatorUserIdError = generatorUserIdError;
const generatorErrorQuery = () => {
    return "se debe ingresar una querry";
};
exports.generatorErrorQuery = generatorErrorQuery;
const errorGetData = () => {
    return `error en el fetch de data 
  `;
};
exports.errorGetData = errorGetData;
const diferentProduct = (id) => {
    return `inexistent product`;
};
exports.diferentProduct = diferentProduct;
