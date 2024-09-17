import ProductsModel from "../models/products.model.js";

class ProductManager {
  // Método para agregar un nuevo producto
  async addProduct({
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      // Validación de campos obligatorios
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("Todos los campos son obligatorios.");
      }

      // Validación de código único
      const existsCode = await ProductsModel.findOne({ code });
      if (existsCode) {
        throw new Error("El código debe ser único.");
      }

      // Creación del nuevo producto
      const newProduct = new ProductsModel({
        title,
        description,
        price,
        code,
        stock,
        category,
        status: true,
        thumbnails,
      });

      // Guardar el producto en la base de datos
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error al agregar un producto:", error.message);
      throw new Error("No se pudo agregar el producto.");
    }
  }

  // Método para obtener todos los productos

  async getProducts(req) {
    try {
      const parsedLimit =
        req && req.query.limit ? parseInt(req.query.limit, 10) : 10;
      const parsedPage =
        req && req.query.page ? parseInt(req.query.page, 10) : 1;
      const sortPaged = req && req.query.sort ? req.query.sort : "asc";

      // Definir las opciones de paginación y de ordenamiento
      const sortOption = sortPaged === "asc" ? { price: 1 } : { price: -1 };

      // Construir la consulta dependiendo de si hay categorías especificadas
      const search =
        req && req.query.query
          ? JSON.parse(this.convertToJsonString(req.query.query))
          : {};

      // Realizar la paginación con las opciones proporcionadas
      const arrayProducts = await ProductsModel.paginate(search, {
        limit: parsedLimit,
        page: parsedPage,
        sort: sortOption,
      });

      const prevLink = arrayProducts.hasPrevPage
        ? `/api/products?page=${arrayProducts.prevPage}&limit=${parsedLimit}${
            req && req.query.query ? `&query=${search}` : ""
          }${req && req.query.sort ? `&sort=${sortOption}` : ""}`
        : null;
      const nextLink = arrayProducts.hasNextPage
        ? `/api/products?page=${arrayProducts.nextPage}&limit=${parsedLimit}${
            req && req.query.query ? `&query=${search}` : ""
          }${req && req.query.sort ? `&sort=${sortOption}` : ""}`
        : null;

      return { arrayProducts, prevLink, nextLink };
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  }

  // Método para obtener un producto por ID

  async getProductById(id) {
    try {
      const obtain = await ProductsModel.findById(id);
      if (!obtain) {
        throw new Error("Producto no encontrado.");
      }
      return obtain;
    } catch (error) {
      console.error("Error al buscar el producto por ID:", error.message);
      throw new Error("No se pudo obtener el producto.");
    }
  }

  // Método para actualizar un producto por ID

  async updateProduct(id, productUpdate) {
    try {
      const update = await ProductsModel.findByIdAndUpdate(id, productUpdate, {
        new: true,
      });
      if (!update) {
        throw new Error("Producto no encontrado.");
      }
      return update;
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      throw new Error("No se pudo actualizar el producto.");
    }
  }

  // Método para eliminar un producto por ID
  async deleteProduct(id) {
    try {
      const deleteado = await ProductsModel.findByIdAndDelete(id);
      if (!deleteado) {
        throw new Error("Producto no encontrado.");
      }
      return deleteado;
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      throw new Error("No se pudo eliminar el producto.");
    }
  }

  convertToJsonString(jsString) {
    // Reemplaza las comillas simples por comillas dobles
    // Agrega comillas dobles a las claves (esto es necesario para JSON)
    const jsonString = jsString
      .replace(/'/g, '"') // Reemplaza comillas simples por comillas dobles
      .replace(/(\w+):/g, '"$1":'); // Añade comillas dobles a las claves

    return jsonString;
  }
}

export default ProductManager;
