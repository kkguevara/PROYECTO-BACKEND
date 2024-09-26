import { Router } from "express";
import UserModel from "../dao/models/users.model.js";
import CartModel from "../dao/models/cart.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";

const router = Router();

//Register
router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name, age } = req.body;

  try {
    //Verificamos si ya existe el usuario.
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).send("El usuario ya existe en la base de datos");
    }

    //Si no existe, se crea:
    const user = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    });

    await user.save();

    // Crear un carrito asociado al nuevo usuario
    const cart = new CartModel({ userId: user._id });
    await cart.save();

    // Asignar el ID del carrito al usuario y guardar
    user.cart = cart._id;
    await user.save();

    //Generar el Token JWT
    const token = jwt.sign(
      {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
      },
      "coderhouse",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("coderCookieToken", token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res.status(500).send("Error interno del servidor", error.message);
  }
});

//Login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //Buscamos al usuario encontardo en MongoDB:
    const userFound = await UserModel.findOne({ email });

    //Si no lo encuentro, lo puedo mandar a registrarse:
    if (!userFound) {
      return res.status(401).send("Usuario no registrado");
    }

    //Verificamos la contraseña:
    if (!isValidPassword(password, userFound)) {
      return res.status(401).send("Contraseña incorrecta");
    }
    //Generamos el token JWT:

    const token = jwt.sign(
      { usuario: userFound.email, rol: userFound.rol },
      "coderhouse",
      { expiresIn: "1h" }
    );

    //Enviamos con la cookie:

    res.cookie("coderCookieToken", token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

//Logout
router.post("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/login");
});

//Current:
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

//Admin

router.get(
  "/admin",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    if (req.user.rol !== "admin") {
      return res.status(403).send("Acceso denegado!");
    }

    //Si el usuario es administrador, mostrar la vista correspondiente:
    res.render("admin");
  }
);

export default router;
