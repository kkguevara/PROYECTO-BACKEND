import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";

const app = express();
const PUERTO = 8080;

// Middleware para manejar JSON

app.use(express.json());

// Usar routers

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
