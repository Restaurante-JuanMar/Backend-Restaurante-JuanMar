import { Router } from "express";
import httpVision from "../controllers/vision.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todas las visiones
router.get("/all", httpVision.getAll);

// Obtener una visión por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpVision.getById
);

// Crear o editar una única visión
router.post(
  "/registro",
  [
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpVision.agregarOEditarVision
);

// Activar una visión por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpVision.putActivar
);

// Inactivar una visión por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpVision.putInactivar
);

export default router;