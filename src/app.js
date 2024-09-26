import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import usersRouter from "./routes/users.router.js";
import viewsRouter from "./routes/views.router.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import multer from "multer";
import ProductManager from "./dao/db/product-manager-db.js";
import "./database.js";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const manager = new ProductManager();

const app = express();
const PUERTO = 8080;

//Configuramos express-handlebars:
app.engine(
  "handlebars",
  exphbs.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware para manejar JSON

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(express.static("./src/public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
app.use(multer({ storage }).single("image"));

// Usar routers

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", usersRouter);
app.use("/", viewsRouter);
//app.use("/,imageRouter");

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
