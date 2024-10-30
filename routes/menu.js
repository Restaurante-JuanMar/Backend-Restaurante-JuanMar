import { Router } from "express";
import httpMenu from "../controllers/menu.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todos los menús
router.get("/all", httpMenu.getAll);

// Obtener menús por posición
router.get("/posicion", httpMenu.getByPosition);

// Obtener un menú por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpMenu.getById
);

// Crear o actualizar un menú
router.post(
  "/registro",
  [
    check(
      "posicion",
      "La posición es obligatoria y debe ser un número"
    ).isNumeric(),
    check("imagen", "La imagen es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  httpMenu.crearOActualizarMenu
);

// Activar un menú por ID
router.put(
  "/activar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpMenu.putActivar
);

// Inactivar un menú por ID
router.put(
  "/inactivar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpMenu.putInactivar
);

export default router;
