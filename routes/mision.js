import { Router } from "express";
import httpMision from "../controllers/mision.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todas las misiones
router.get("/all", httpMision.getAll);

// Obtener una misión por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpMision.getById
);

// Crear o editar una única misión
router.post(
  "/registro",
  [
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpMision.agregarOEditarMision
);

// Activar una misión por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpMision.putActivar
);

// Inactivar una misión por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpMision.putInactivar
);

export default router;
