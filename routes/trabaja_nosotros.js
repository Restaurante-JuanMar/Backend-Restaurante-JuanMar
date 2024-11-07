import { Router } from "express";
import httpTrabajaNosotros from "../controllers/trabaja_nosotros.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Get - Obtener todas las solicitudes
router.get("/all", httpTrabajaNosotros.getAll);

// Get - Obtener solicitud por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpTrabajaNosotros.getById
);

// Post - Crear nueva solicitud
router.post(
  "/registro",
  [
    check("nombre", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido", "Digite su apellido, por favor").not().isEmpty(),
    check("correo", "Digite su correo, por favor").not().isEmpty(),
    check("correo", "Correo no válido, digite bien su correo").isEmail(),
    check("telefono", "Digite su número telefónico, por favor").not().isEmpty(),
    check("telefono", "El número telefónico debe ser un valor numérico").isNumeric(),
    check("cargo", "Digite el cargo al que aplica, por favor").not().isEmpty(),
    check("hoja_vida", "Cargue la hoja de vida, por favor").not().isEmpty(),
    validarCampos,
  ],
  httpTrabajaNosotros.crearSolicitud
);

// Put - Editar solicitud por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("nombre", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido", "Digite su apellido, por favor").not().isEmpty(),
    check("correo", "Digite su correo, por favor").not().isEmpty(),
    check("correo", "Correo no válido, digite bien su correo").isEmail(),
    check("telefono", "Digite su número telefónico, por favor").not().isEmpty(),
    check("telefono", "El número telefónico debe ser un valor numérico").isNumeric(),
    check("cargo", "Digite el cargo al que aplica, por favor").not().isEmpty(),
    validarCampos,
  ],
  httpTrabajaNosotros.editarSolicitud
);

// Put - Activar solicitud por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpTrabajaNosotros.putActivar
);

// Put - Inactivar solicitud por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpTrabajaNosotros.putActivar
);

export default router;
