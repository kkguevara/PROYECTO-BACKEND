import CartModel from "../models/cart.model.js";

class CartManager {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(
        `No se pudo crear el carrito de compras, ${error.message}`
      );
    }
  }

  async getCarts() {
    try {
      const carts = await CartModel.find();
      return carts;
    } catch (error) {
      throw new Error(`Error al buscar carritos: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId)
        .populate("products.product")
        .lean();
      if (!cart) {
        throw new Error("No existe un carrito con ese ID.");
      }
      return cart;
    } catch (error) {
      throw new Error(`No se pudo obtener el carrito, ${error.message}`);
    }
  }

  async addProductsToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await CartModel.findById(cartId);
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
      throw new Error(
        `No se pudo agregar el producto al carrito: ${error.message}`
      );
    }
  }

  async deleteProductFromCart(cartId, prodId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado`);
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === prodId
      );

      if (productIndex === -1) {
        throw new Error(
          `Producto con ID ${prodId} no encontrado en el carrito`
        );
      }
      const [deletedProduct] = cart.products.splice(productIndex, 1);

      await cart.save();

      return deletedProduct;
    } catch (error) {
      throw new Error(
        `Error al eliminar el producto del carrito: ${error.message}`
      );
    }
  }

  async updateCart(cid, products) {
    try {
      const cart = await CartModel.findById(cid);
      cart.products = products;
      const resultUpdated = await cart.save();

      return resultUpdated;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid);
      const product = cart.products.find(
        (product) => product.product._id.toString() === pid
      );

      if (!product) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      product.quantity = quantity;
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async clearCart(cid) {
    try {
      const cart = await CartModel.findById(cid);
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}

export default CartManager;
