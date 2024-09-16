import { Router } from "express";

import ProductManager from "../dao/db/product-manager-db.js";

import ProductsModel from "../dao/models/products.model.js"; //aqui nuevo, importamos el model

const manager = new ProductManager();

const router = Router();

// Obtener todos los productos

router.get("/", async (req, res) => {
  try {
    // Desestructurar los parámetros de consulta
    const { category, sort, limit = 10, page = 1 } = req.query;

    // Convertir limit y page a enteros
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;

    // Opciones de paginación
    const options = {
      limit: parsedLimit,
      page: parsedPage,
    };

    // Obtener productos desde el manager
    const arrayProducts = await manager.getProducts(options, category, sort);

    // Construcción de los enlaces de paginación
    const buildLink = (page) =>
      `/api/products?page=${page}&limit=${parsedLimit}${
        category ? `&category=${category}` : ""
      }${sort ? `&sort=${sort}` : ""}`;

    const prevLink = arrayProducts.hasPrevPage
      ? buildLink(arrayProducts.prevPage)
      : null;
    const nextLink = arrayProducts.hasNextPage
      ? buildLink(arrayProducts.nextPage)
      : null;

    // Enviar la respuesta con estado, datos y enlaces de paginación
    res.status(200).json({
      status: "success",
      data: arrayProducts.docs, // Solo los productos
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
    console.error("Error al obtener productos en el router:", error);
    res.status(500).json({
      status: "error",
      message: "No se pudo obtener los productos. Intente nuevamente.",
    });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductsModel.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    res.send(product);
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
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

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
    const deletedProduct = await ProductsModel.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    res.status(200).send({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).send({ message: "Error interno del servidor" });
  }
});

export default router;
