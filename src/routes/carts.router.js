import { Router } from "express";

import CartManager from "../controllers/carts.manager.js"

const manager = new CartManager("./src/data/carts.json");

const router = Router(); 

// Ruta para crear un nuevo carrito

router.post('/', async (req, res) => {
    const result = await manager.createCart();
    res.status(result.status).json(result);
  });

  // Ruta para listar los productos de un carrito por su ID

router.get('/:cid', async (req, res) => {
    try {
      const cart = await manager.getCartById(req.params.cid); // Obtiene el carrito por su ID
      res.json(cart.products); 
    } catch (error) {
      res.status(404).json({ message: error.message }); 
    }
  });
  // Ruta para agregar un producto al carrito

router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const cart = await manager.addProductToCart(req.params.cid, req.params.pid); // Agrega el producto al carrito
      res.json(cart); 
    } catch (error) {
      res.status(404).json({ message: error.message }); // Retorna un error si no se encuentra 
    }
  });

  export default router;