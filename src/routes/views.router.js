import express from "express";
import ProductManager from "../controllers/product.manager.js";

//import { Router } from "express";

const router = express.Router();
const manager = new ProductManager("./src/data/products.json");

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
