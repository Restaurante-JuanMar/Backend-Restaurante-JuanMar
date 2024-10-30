import { Router } from "express";
import httpContactar from "../controllers/contactenos.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

//Get
router.get("/all", httpContactar.getTodo);

router.get("/:id", httpContactar.getById);

//Post
router.post(
  "/registro",
  [
    check("nombre", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido", "Digite su apellido, por favor").not().isEmpty(),
    check("telefono", "Digite su número telefónico, por favor").not().isEmpty(),
    check("correo", "Digite su correo, por favor").not().isEmpty(),
    check("correo", "Correo no válido, digite bien su correo").isEmail(),
    validarCampos,
  ],
  httpContactar.crearSolicitud
);

//Put
router.put(
  "/editar/:id",
  [
    check("nombre", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido", "Digite su apellido, por favor").not().isEmpty(),
    check("telefono", "Digite su número telefónico, por favor").not().isEmpty(),
    check("correo", "Digite su correo, por favor").not().isEmpty(),
    check("correo", "Correo no válido, digite bien su correo").isEmail(),
    validarCampos,
  ],
  httpContactar.editarSolicitud
);

router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpContactar.putInactivar
);

router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpContactar.putActivar
);

export default router;