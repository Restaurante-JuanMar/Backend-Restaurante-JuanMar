import { Router } from "express";
import httpPlatoEspecial from "../controllers/plato_especial.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Obtener todos los platos especiales
router.get("/all", httpPlatoEspecial.getAll);

// Obtener un plato especial por ID
router.get("/:id", [
  check("id", "Ingrese un ID válido").not().isEmpty(),
  check("id", "Ingrese un ID válido").isMongoId(),
  validarCampos,
], httpPlatoEspecial.getById);

// Crear un nuevo plato especial
router.post(
  "/registro",
  [
    check("nombre_plat", "El nombre del plato es obligatorio").not().isEmpty(),
    check("descrip_plat", "La descripción del plato es obligatoria").not().isEmpty(),
    check("imagen", "Añada una imagen").not().isEmpty(),
    validarCampos,
  ],
  httpPlatoEspecial.crearPlato
);

// Editar un plato especial por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("nombre_plat", "El nombre del plato es obligatorio").not().isEmpty(),
    check("descrip_plat", "La descripción del plato es obligatoria").not().isEmpty(),
    check("imagen", "Añada una imagen").not().isEmpty(),
    validarCampos,
  ],
  httpPlatoEspecial.editarPlato
);

// Activar un menú por ID
router.put(
    "/activar/:id",
    [
      check("id", "Ingrese un ID válido").not().isEmpty(),
      check("id", "Ingrese un ID válido").isMongoId(),
      validarCampos,
    ],
    httpPlatoEspecial.putActivar
  );
  
  // Inactivar un menú por ID
  router.put(
    "/inactivar/:id",
    [
      check("id", "Ingrese un ID válido").not().isEmpty(),
      check("id", "Ingrese un ID válido").isMongoId(),
      validarCampos,
    ],
    httpPlatoEspecial.putInactivar
  );

export default router;
