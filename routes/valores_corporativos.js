import { Router } from "express";
import httpValoresCorporativos from "../controllers/valores_corporativos.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todos los valores corporativos
router.get("/all", httpValoresCorporativos.getAll);

// Obtener un valor corporativo por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpValoresCorporativos.getById
);

// Crear un nuevo valor corporativo
router.post(
  "/registro",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpValoresCorporativos.crearValor
);

// Editar un valor corporativo por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpValoresCorporativos.editarValor
);

// Activar un valor corporativo por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpValoresCorporativos.putActivar
);

// Inactivar un valor corporativo por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpValoresCorporativos.putInactivar
);

export default router;
