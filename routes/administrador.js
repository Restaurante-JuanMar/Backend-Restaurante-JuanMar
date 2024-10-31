import { Router } from "express";
import httpAdministrador from "../controllers/administrador.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

//Get
router.get("/all", httpAdministrador.getAll);

//Get by ID
router.get("/:id", httpAdministrador.getById);

//Post
router.post(
  "/registro",
  [
    check("nombre", "Digite el nombre").not().isEmpty(),
    check("apellido", "Digite el apellido").not().isEmpty(),
    check("cedula", "Digite la cédula").not().isEmpty(),
    check("correo", "Digite el correo").not().isEmpty(),
    check("telefono", "Digite el telefono").not().isEmpty(),
    check("password", "Digite la contraseña").not().isEmpty(),
    validarCampos,
  ],
  httpAdministrador.crearUsuario
);

router.post(
  "/login",
  [
    check("cedula", "Digite su identificacion").not().isEmpty(),
    check("password", "Digite la contraseña").not().isEmpty(),
  ],
  httpAdministrador.login
);

//Put
router.put(
  "/editar/:id",
  [
    check("nombre", "Digite el nombre").not().isEmpty(),
    check("apellido", "Digite el apellido").not().isEmpty(),
    check("cedula", "Digite la cédula").not().isEmpty(),
    check("correo", "Digite el correo").not().isEmpty(),
    check("telefono", "Digite el telefono").not().isEmpty(),
    validarCampos,
  ],
  httpAdministrador.editarUsuario
);

router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpAdministrador.putInactivar
);

router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpAdministrador.putActivar
);

export default router;