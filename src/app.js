import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./controllers/product.manager.js";

const manager = new ProductManager("./src/data/products.json");

const app = express();
const PUERTO = 8080;

// configuramos Express-Handelebars

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware para manejar JSON

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Usar routers

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

//Instancia desde el lado del backend

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se conectó");

  socket.emit("products", await manager.getProducts());

  socket.on("deleteProduct", async (id) => {
    await manager.deleteProduct(id);

    io.emit("products", await manager.getProducts());
  });

  /*** Add product ***/
  socket.on("product", async (data) => {
    await manager.createProduct(data);
    //*** Reload products ***/
    io.emit("products", await manager.getProducts());

    console.log(data);
  });
});
