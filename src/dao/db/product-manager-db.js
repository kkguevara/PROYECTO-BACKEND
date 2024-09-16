import ProductsModel from "../models/products.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

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

  async getProducts({ limit = 10, page = 1, sort = "asc" } = {}, category) {
    try {
      // Definir las opciones de paginación y de ordenamiento
      const sortOption = sort === "asc" ? { price: 1 } : { price: -1 };

      // Construir la consulta dependiendo de si hay categorías especificadas
      const query = category ? { category } : {};

      // Realizar la paginación con las opciones proporcionadas
      const arrayProducts = await ProductsModel.paginate(query, {
        limit,
        page,
        sort: sortOption,
      });

      return arrayProducts;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error; // Re-lanza el error para manejarlo adecuadamente fuera de esta función
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
}

export default ProductManager;
