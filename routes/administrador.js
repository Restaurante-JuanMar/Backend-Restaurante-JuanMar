import { Router } from "express";
import httpAdministrador from "../controllers/administrador.js";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import validarCampos from "../middlewares/validar.js";
import helpersUsuario from "../helpers/usuario.js";

const router = new Router();

//Get
router.get("/all", httpAdministrador.getAll);

//Get by ID
router.get("/:id", httpAdministrador.getById);

router.get(
  "/codigo-recuperar/:correo",
  [
    check("correo", "Por favor ingrese el correo").not().isEmpty(),
    check("correo").custom(helpersUsuario.existeCorreo),
    validarCampos,
  ],
  httpAdministrador.codigoRecuperar
);

router.get(
  "/confirmar-codigo/:codigo",
  [check("codigo", "Ingrese el código").not().isEmpty(), validarCampos],
  httpAdministrador.confirmarCodigo
);

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
    check("correo", "Dirección de correo no válida").isEmail(),
    check("telefono", "Digite el telefono").not().isEmpty(),
    validarCampos,
  ],
  httpAdministrador.editarUsuario
);

router.put(
  "/cambioPassword/:id",
  [
    validarJWT,
    check("id", "Digite el id").not().isEmpty(),
    check("id", "No es mongo id").isMongoId(),
    check("password", "Digite la contraseña").not().isEmpty(),
    check("newPassword", "Digite la nueva contraseña").not().isEmpty(),
  ],
  httpAdministrador.putCambioPassword
);

router.put(
  "/nueva-password",
  [
    check("correo", "Por favor ingrese el correo").not().isEmpty(),
    check("correo").custom(helpersUsuario.existeCorreoNewPass),
    check("codigo", "Ingrese el código").not().isEmpty(),
    check("password", "Ingrese la password").not().isEmpty(),
    validarCampos,
  ],
  httpAdministrador.nuevaPassword
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
