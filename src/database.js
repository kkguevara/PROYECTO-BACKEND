import mongoose from "mongoose";

// nos conectamos a la BD de MongoDB atlas
mongoose
  .connect(
    "mongodb+srv://karelysGuevara:maruja28@cluster0.1qhwn.mongodb.net/vinos?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("conectado a la base de datos vinos"))
  .catch(() => console.log("error de conexión"));
