import { Router } from "express";
import httpCarta from "../controllers/carta_menu.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todos los archivos de la carta
router.get("/all", httpCarta.getAll);

// Obtener un archivo de la carta por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpCarta.getById
);

// Crear un nuevo archivo de la carta
router.post(
  "/registro",
  [
    check("archivoUrl", "La URL del archivo es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpCarta.crearCarta
);

// Editar un archivo de la carta por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("archivoUrl", "La URL del archivo es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpCarta.editarCarta
);

// Activar un archivo de la carta por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpCarta.putActivar
);

// Inactivar un archivo de la carta por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpCarta.putInactivar
);

export default router;
