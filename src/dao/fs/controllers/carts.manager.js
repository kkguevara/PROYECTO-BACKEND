import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart() {
    const result = {
      status: 0,
      message: "",
      data: [],
    };

    const newCart = {
      id: uuidv4(),
      products: [],
    };

    try {
      const carts = await this.leerArchivo();
      carts.push(newCart);
      await this.guardarArchivo(carts);
      result.data = newCart;
      result.message = "Carrito creado";
      result.status = 201;
      return result;
    } catch (error) {
      result.message = "Error al crear el carrito: " + error.message;
      result.status = 500;
      return result;
    }
  }

  // Método para obtener todos los carritos

  async getCarts() {
    try {
      const carts = await this.leerArchivo();
      return carts;
    } catch (error) {
      console.error("Error al obtener carritos:", error.message);
      throw error;
    }
  }

  // Método para obtener un carrito por su ID

  async getCartById(id) {
    try {
      const carts = await this.leerArchivo();
      const soughtCart = carts.find((cart) => cart.id === id);

      if (!soughtCart) {
        throw new Error("Carrito no encontrado");
      }
      return soughtCart;
    } catch (error) {
      console.error("Error al obtener carrito:", error.message);
      throw error;
    }
  }

  // Método para agregar un producto al carrito

  async addProductToCart(cartId, product) {
    try {
      const carts = await this.leerArchivo();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }

      carts[cartIndex].products.push(product);

      await this.guardarArchivo(carts);
      return carts[cartIndex];
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      throw error;
    }
  }

  // Método para leer el archivo de carritos

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

  // Método para guardar carritos en el archivo

  async guardarArchivo(arrayCarts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    } catch (error) {
      console.error("Error al guardar archivo:", error.message);
      throw error;
    }
  }
}

export default CartManager;
