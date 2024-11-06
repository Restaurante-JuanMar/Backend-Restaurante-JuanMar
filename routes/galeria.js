import { Router } from "express";
import httpGaleria from "../controllers/galeria.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todas las imágenes de la galería
router.get("/all", httpGaleria.getAll);

router.get("/fecha", httpGaleria.getByFecha);

router.get("/posicion", httpGaleria.getByPosition);

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
    check("nombre_gal", "Digite el nombre del evento, por favor").not().isEmpty(),
    check("posicion", "Escoja una posición de foto, por favor").not().isEmpty(),
    check("fecha_gal", "La fecha es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpGaleria.crearOActualizarGaleria
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
