import { Router } from "express";
import httpListadoPlatos from "../controllers/listado_platos.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todos los documentos de ListadoPlatos
router.get("/all", httpListadoPlatos.getAll);

// Obtener un documento de ListadoPlatos por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpListadoPlatos.getById
);

// Crear un nuevo documento en ListadoPlatos
router.post(
  "/registro",
  [
    check("archivoUrl", "El archivo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  httpListadoPlatos.crearListadoPlato
);

// Editar un documento de ListadoPlatos por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("archivoUrl", "El archivo es obligatorio").not().isEmpty(),
    check("idReserva", "El ID de la reserva es obligatorio").not().isEmpty(),
    check("idReserva", "Ingrese un ID de reserva válido").isMongoId(),
    validarCampos,
  ],
  httpListadoPlatos.editarListadoPlato
);

// Activar un documento de ListadoPlatos por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpListadoPlatos.putActivar
);

// Inactivar un documento de ListadoPlatos por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpListadoPlatos.putInactivar
);

export default router;
