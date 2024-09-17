import { Router } from "express";

import CartManager from "../dao/db/cart-manager-db.js";

const manager = new CartManager();

const router = Router();

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  const result = await manager.createCart();
  res.status(201).json(result);
});

// Ruta para listar los productos de un carrito por su ID
router.get("/:cid", async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// Ruta para agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await manager.addProductsToCart(
      req.params.cid,
      req.params.pid
    ); // Agrega el producto al carrito
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const deletedProduct = await manager.deleteProductFromCart(cid, pid);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }
    res.status(200).json({
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
      error: error.message,
    });
  }
});

// Actualizar carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const result = await manager.updateCart(cid, products);

    res.status(200).json({
      message: "Carrito actualizado",
      cart: JSON.stringify(result),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el carrito",
      error: error.message,
    });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const product = await manager.updateProductQuantity(cid, pid, quantity);

    res.status(200).json({
      message: "Cantidad de producto actualizada",
      product: JSON.stringify(product),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la cantidad del producto",
      error: error.message,
    });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    await manager.clearCart(cid);

    res.status(200).json({
      message: "Todos los productos eliminados del carrito",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al borrar el carrito",
      error: error.message,
    });
  }
});

export default router;
