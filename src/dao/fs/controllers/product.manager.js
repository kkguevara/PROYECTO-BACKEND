import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async createProduct(body) {
    const result = {
      status: 0,
      message: "",
      data: [],
    };

    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = body;

    const arrayProducts = await this.leerArchivo();

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      typeof status !== "boolean" ||
      !stock ||
      !category
    ) {
      result.message =
        "Todos los campos son obligatorios, a excepción de thumbnails.";
      result.status = 400;

      return result;
    }

    if (arrayProducts.some((item) => item.code === code)) {
      result.message = "El código del producto ya existe.";
      result.status = 400;

      return result;
    }

    // Asigna un id único
    const myuuid = uuidv4();
    console.log("UUID is: " + myuuid);

    const newProduct = {
      id: myuuid,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    try {
      arrayProducts.push(newProduct);
      await this.guardarArchivo(arrayProducts);
      result.data = newProduct;
      result.message = "Producto agregado";
      result.status = 201;
      return result;
    } catch (error) {
      result.message = "Error al guardar el producto: " + error.message;
      result.status = 500;
      return result;
    }
  }

  // Método para obtener todos los productos

  async getProducts() {
    try {
      const arrayProducts = await this.leerArchivo();
      return arrayProducts;
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
      throw error;
    }
  }

  // Método para obtener un producto por su ID

  async getProductById(id) {
    try {
      const arrayProducts = await this.leerArchivo();
      const sought = arrayProducts.find((item) => item.id === id);

      if (!sought) {
        throw new Error("Producto no encontrado");
      }
      return sought;
    } catch (error) {
      console.error("Error al obtener producto:", error.message);
      throw error;
    }
  }

  // Método para actualizar un producto por su ID

  async updateProduct(id, updates) {
    try {
      const arrayProducts = await this.leerArchivo();

      const index = arrayProducts.findIndex((item) => item.id === id);

      if (index === -1) {
        throw new Error("Producto no encontrado");
      }

      const updatedProduct = { ...arrayProducts[index], ...updates, id };
      arrayProducts[index] = updatedProduct;

      await this.guardarArchivo(arrayProducts);
      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar producto:", error.message);
      throw error;
    }
  }

  // Método para eliminar un producto por su ID

  async deleteProduct(id) {
    try {
      const arrayProducts = await this.leerArchivo();
      const newProductsArray = arrayProducts.filter((item) => item.id !== id);

      if (newProductsArray.length === arrayProducts.length) {
        throw new Error("Producto no encontrado");
      }

      await this.guardarArchivo(newProductsArray);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
      throw error;
    }
  }

  // Método auxiliar para leer el archivo de productos

  async leerArchivo() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      if (data !== "") return JSON.parse(data);
      else return [];
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      } else {
        throw error;
      }
    }
  }

  // Método auxiliar para guardar productos en el archivo
  
  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.error("Error al guardar archivo:", error.message);
      throw error;
    }
  }
}

export default ProductManager;
