import CartModel from "../models/cart.model.js";

class CartManager {
  // Método para crear un nuevo carrito
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error al crear un carrito de compras:", error);
      throw new Error("No se pudo crear el carrito de compras.");
    }
  }

  // Método para obtener un carrito por ID
  async getCartById(cart) {
    try {
      const cartId = await CartModel.findById(cart);
      if (!cartId) {
        throw new Error("No existe un carrito con ese ID.");
      }
      return cartId;
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw new Error("No se pudo obtener el carrito.");
    }
  }

  // Método para agregar productos al carrito

  async addProductsToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existsProduct = cart.products.find(
        (p) => p.product.toString() === productId
      );

      if (existsProduct) {
        existsProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      // Marcar la propiedad "products" como modificada antes de guardar

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar un producto:", error);
      throw new Error("No se pudo agregar el producto al carrito.");
    }
  }

  // Método para eliminar un producto del carrito

  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;

    try {
      const cart = await CartModel.findById(cid);
      cart.products = cart.products.filter(
        (product) => product.product.toString() !== pid
      );
      await cart.save();
      res.json({ status: "éxito", message: "Producto eliminado del carrito" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el producto del carrito",
        error,
      });
    }
  }
  // Método para actualizar el carrito con un arreglo de productos

  async updateCart(req, res) {
    const { cid } = req.params;
    const { products } = req.body;

    try {
      const cart = await CartModel.findById(cid);
      cart.products = products;
      await cart.save();
      res.json({ status: "éxito", message: "Carrito actualizado" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el carrito",
        error,
      });
    }
  }
  // Método para actualizar solo la cantidad de un producto en el carrito
  async updateProductQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const cart = await CartModel.findById(cid);
      const product = cart.products.find(
        (product) => product.productId.toString() === pid
      );
      if (product) {
        product.quantity = quantity;
        await cart.save();
        res.json({
          status: "éxito",
          message: "Cantidad de producto actualizada",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Producto no encontrado en el carrito",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al actualizar la cantidad del producto",
        error,
      });
    }
  }

  // Método para eliminar todos los productos del carrito
  async clearCart(req, res) {
    const { cid } = req.params;

    try {
      const cart = await CartModel.findById(cid);
      cart.products = [];
      await cart.save();
      res.json({
        status: "éxito",
        message: "Todos los productos eliminados del carrito",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al borrar el carrito",
        error,
      });
    }
  }
}

export default CartManager;
