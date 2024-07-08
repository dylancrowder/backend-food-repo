interface Food {
  img: string;
  title: string;
  parrafo: string;
  price: number;
  category: string;
}

export const generatorUserError = (data: any) => {
  return `Todos los campos son requeridos y deben ser validos 😱.
        Lista de campos recibidos en la solicitud:
        - first_name  : ${data.first_name}
        - last_name   : ${data.last_name}
        - email       : ${data.email}
        - age         : ${data.age}
        `;
};

export const createProductError = (data: Food) => {
  return `Todos los campos son requeridos y deben ser validos 😱.
    Lista de campos recibidos en la solicitud:
    - imagen        : ${data.img}
    - titulo        : ${data.title}
    - parrafo       : ${data.parrafo}
    - precio        : ${data.price}
    - categoria     : ${data.category}
    `;
};

export const generatorUserIdError = (id: string) => {
  return `Se debe enviar un identificador valido 😱.
        Valor recibido: ${id}
      `;
};

export const generatorErrorQuery = () => {
  return "se debe ingresar una querry";
};

export const errorGetData = () => {
  return `error en el fetch de data 
  `;
};

export const diferentProduct = (id: string) => {
  return `inexistent product`;
};
