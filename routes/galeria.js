import { Router } from "express";
import httpGaleria from "../controllers/galeria.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todas las imágenes de la galería
router.get("/all", httpGaleria.getAll);

// Obtener una imagen de la galería por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpGaleria.getById
);

// Crear una nueva imagen en la galería
router.post(
  "/registro",
  [
    check("imagen", "La imagen es obligatoria").not().isEmpty(),
    check("descrip_gal", "La descripción es obligatoria").not().isEmpty(),
    check("fecha_gal", "La fecha es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpGaleria.crearGaleria
);

// Editar una imagen de la galería por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("imagen", "La imagen es obligatoria").not().isEmpty(),
    check("descrip_gal", "La descripción es obligatoria").not().isEmpty(),
    check("fecha_gal", "La fecha es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpGaleria.editarGaleria
);

// Activar una imagen de la galería por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpGaleria.putActivar
);

// Inactivar una imagen de la galería por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpGaleria.putInactivar
);

export default router;
