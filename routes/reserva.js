import { Router } from "express";
import httpReserva from "../controllers/reserva.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Get - Obtener todas las reservas
router.get("/all", httpReserva.getAll);

// Get - Obtener reserva por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpReserva.getById
);

// Post - Crear nueva reserva
router.post(
  "/registro",
  [
    check("nombre_cliente", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido_cliente", "Digite su apellido, por favor").not().isEmpty(),
    check("correo_cliente", "Digite su correo, por favor").not().isEmpty(),
    check("correo_cliente", "Correo no válido, digite bien su correo").isEmail(),
    check("telefono_cliente", "Digite su número telefónico, por favor").not().isEmpty(),
    check("num_personas", "Digite el número de personas, por favor").not().isEmpty(),
    check("fecha_res", "Digite la fecha de la reserva, por favor").not().isEmpty(),
    validarCampos,
  ],
  httpReserva.crearReserva
);

// Put - Editar reserva por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("nombre_cliente", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido_cliente", "Digite su apellido, por favor").not().isEmpty(),
    check("correo_cliente", "Digite su correo, por favor").not().isEmpty(),
    check("correo_cliente", "Correo no válido, digite bien su correo").isEmail(),
    check("telefono_cliente", "Digite su número telefónico, por favor").not().isEmpty(),
    check("num_personas", "Digite el número de personas, por favor").not().isEmpty(),
    check("fecha_res", "Digite la fecha de la reserva, por favor").not().isEmpty(),
    validarCampos,
  ],
  httpReserva.editarReserva
);

// Put - Aprobar reserva por ID
router.put(
  "/aprobar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpReserva.putAprobar
);

// Put - Activar reserva por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpReserva.putActivar
);

// Put - Inactivar reserva por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpReserva.putInactivar
);

export default router;
