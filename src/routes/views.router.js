import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/product-manager-db.js";

//import { Router } from "express";

const router = express.Router();
const manager = new ProductManager();
const cartManager = new CartManager();

//Ruta products que me muestra el listado actual de mis productos. Utilizando express-handlebars.

router.get("/products", async (req, res) => {
  const arrayProducts = await manager.getProducts();
  res.render("home", { arrayProducts });
});

// muestra los produtos en tiempo real con formulario para agregar y boton de eliminar

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

export default router;
