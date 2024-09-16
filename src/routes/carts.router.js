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
    const cart = await manager.getCartById(req.params.cid); // Obtiene el carrito por su ID
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// Ruta para agregar un producto al carrito

router.post("/:cid/product/:pid", async (req, res) => {
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
router.delete("/api/carts/:cid/products/:pid", async (req, res) => {
  const pid = req.params;

  try {
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== pid
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
});

// Actualizar carrito con un arreglo de productos

router.put("/api/carts/:cid", async (req, res) => {
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
});
// Actualizar cantidad de un producto en el carrito

router.put("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
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
});

// Eliminar todos los productos del carrito

router.delete("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    cart.products = [];
    await cart.save();
    res.json({
      status: "éxito",
      message: "Todos los productos eliminados del carrito.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al borrar el carrito", error });
  }
});

export default router;
