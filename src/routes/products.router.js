import { Router } from "express";

import ProductManager from "../controllers/product.manager.js";

const manager = new ProductManager("./src/data/products.json");

const router = Router();

// Obtener todos los productos

router.get("/", async (req, res) => {
  let limit = req.query.limit;
  try {
    const arrayProducts = await manager.getProducts();

    if (limit) {
      res.send(arrayProducts.slice(0, limit));
    } else {
      res.send(arrayProducts);
    }
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener un producto por ID

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await manager.getProductById(id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

//para agregar un nuevo producto

router.post("/", async (req, res) => {
  const response = await manager.createProduct(req.body);
  res.status(response.status).json(response);
});

// actualiza un producto por ID

router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updatedProduct = await manager.updateProduct(req.params.id, updates);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// eliminar un producto por ID

router.delete("/:id", async (req, res) => {
  try {
    await manager.deleteProduct(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
