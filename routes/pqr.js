import { Router } from "express";
import httpPqr from "../controllers/pqr.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";

const router = new Router();

// Get - Obtener todas las PQRs
router.get("/all", httpPqr.getAll);

// Get - Obtener PQR por ID
router.get(
  "/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    validarCampos,
  ],
  httpPqr.getById
);

// Post - Crear nueva PQR
router.post(
  "/registro",
  [
    check("nombre", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido", "Digite su apellido, por favor").not().isEmpty(),
    check("tipoDocumento", "Seleccione un tipo de documento, por favor").not().isEmpty(),
    check("numDocumento", "Digite su número de documento, por favor").not().isEmpty(),
    check("correo", "Digite su correo, por favor").not().isEmpty(),
    check("correo", "Correo no válido, digite bien su correo").isEmail(),
    check("telefono", "Digite su número telefónico, por favor").not().isEmpty(),
    check("tipoPqr", "Seleccione el tipo de PQR, por favor").not().isEmpty(),
    check("asunto", "Digite el asunto de su solicitud, por favor").not().isEmpty(),
    check("descripcion", "Digite la descripción de su solicitud, por favor").not().isEmpty(),
    validarCampos,
  ],
  httpPqr.crearPqr
);

// Put - Editar PQR por ID
router.put(
  "/editar/:id",
  [
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("nombre", "Digite su nombre, por favor").not().isEmpty(),
    check("apellido", "Digite su apellido, por favor").not().isEmpty(),
    check("tipoDocumento", "Seleccione un tipo de documento, por favor").not().isEmpty(),
    check("numDocumento", "Digite su número de documento, por favor").not().isEmpty(),
    check("correo", "Digite su correo, por favor").not().isEmpty(),
    check("correo", "Correo no válido, digite bien su correo").isEmail(),
    check("telefono", "Digite su número telefónico, por favor").not().isEmpty(),
    check("tipoPqr", "Seleccione el tipo de PQR, por favor").not().isEmpty(),
    check("asunto", "Digite el asunto de su solicitud, por favor").not().isEmpty(),
    check("descripcion", "Digite la descripción de su solicitud, por favor").not().isEmpty(),
    validarCampos,
  ],
  httpPqr.editarPqr
);

router.put(
    "/inactivar/:id",
    [
      check("id", "Ingrese un ID válido").not().isEmpty(),
      check("id", "Ingrese un ID válido").isMongoId(),
      validarCampos,
    ],
    httpPqr.putInactivar
  );
  
  router.put(
    "/activar/:id",
    [
      check("id", "Ingrese un ID válido").not().isEmpty(),
      check("id", "Ingrese un ID válido").isMongoId(),
      validarCampos,
    ],
    httpPqr.putActivar
  );

export default router;
