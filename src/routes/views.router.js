import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const manager = new ProductManager();
const cartManager = new CartManager();

//Ruta products que me muestra el listado actual de mis productos. Utilizando express-handlebars.

router.get("/products", async (req, res) => {
  const { arrayProducts, prevLink, nextLink } = await manager.getProducts();

  res.render("home", {
    products: arrayProducts.docs,
    hasPrevPage: arrayProducts.hasPrevPage,
    hasNextPage: arrayProducts.hasNextPage,
    prevPage: arrayProducts.prevPage,
    nextPage: arrayProducts.nextPage,
    currentPage: arrayProducts.page,
    totalPages: arrayProducts.totalPages,
    prevLink,
    nextLink,
  });
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const product = await manager.getProductById(id);

    console.log(product);

    res.render("details", { product });
  } catch (error) {
    console.error("Error en el router:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

//Ruta para obtener un carrito por su ID
router.get("/carts/:id", async (req, res) => {
  const cartId = req.params.id;
  try {
    const cart = await cartManager.getCartById(cartId);

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// muestra los produtos en tiempo real con formulario para agregar y boton de eliminar

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

export default router;
