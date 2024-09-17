import { Router } from "express";

import ProductManager from "../dao/db/product-manager-db.js";

const manager = new ProductManager();

const router = Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const { arrayProducts, prevLink, nextLink } = await manager.getProducts(
      req
    );

    res.status(200).json({
      data: arrayProducts.docs,
      pagination: {
        totalDocs: arrayProducts.totalDocs,
        limit: arrayProducts.limit,
        totalPages: arrayProducts.totalPages,
        page: arrayProducts.page,
        pagingCounter: arrayProducts.pagingCounter,
        hasPrevPage: arrayProducts.hasPrevPage,
        hasNextPage: arrayProducts.hasNextPage,
        prevPage: arrayProducts.prevPage,
        nextPage: arrayProducts.nextPage,
        prevLink,
        nextLink,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "No se pudo obtener los productos. Intente nuevamente.",
    });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    const product = await manager.addProduct(newProduct);

    res.status(201).send({ message: "Producto guardado con éxito", product });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al crear el producto. Intente nuevamente." });
  }
});

// Actualizar un producto por ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await manager.updateProduct(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    res.status(200).send({
      message: "Producto actualizado con éxito",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).send({ message: "Error interno del servidor" });
  }
});

// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await manager.deleteProduct(req.params.id);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    res.status(200).send({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).send({ message: "Error interno del servidor" });
  }
});

export default router;
