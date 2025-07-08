import { Router } from "express";
import httpEmpleado from "../controllers/empleado.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import helpersEmpleado from "../helpers/empleado.js";

const router = Router();

router.get("/listar", [validarJWT], httpEmpleado.getEmpleados);
router.get("/listaractivos", [validarJWT], httpEmpleado.getEmpleadosActivos);
router.get("/listarinactivos", [validarJWT], httpEmpleado.getEmpleadosInactivos);

router.get("/listarid/:id", [
  validarJWT,
  check("id", "No es un ID válido").isMongoId(),
  check("id").custom(helpersEmpleado.validarExisteId),
  validarCampos
], httpEmpleado.getEmpleadoById);

router.post("/crear", [
  validarJWT,
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("documento", "El documento es obligatorio").notEmpty(),
  check("documento").custom(helpersEmpleado.documentoExiste),
  check("correo", "Correo inválido").isEmail(),
  check("correo").custom(helpersEmpleado.correoExiste),
  check("telefono", "El teléfono es obligatorio").notEmpty(),
  check("direccion", "La dirección es obligatoria").notEmpty(),
  check("fechaNacimiento", "Fecha de nacimiento obligatoria").notEmpty(),
  check("fechaContratacion", "Fecha de contratación obligatoria").notEmpty(),
  check("cargo", "El cargo es obligatorio").notEmpty(),
  check("salario", "El salario es obligatorio y debe ser numérico").isNumeric(),
  validarCampos
], httpEmpleado.postEmpleado);

router.put("/modificar/:id", [
  validarJWT,
  check("id", "ID inválido").isMongoId(),
  check("id").custom(helpersEmpleado.validarExisteId),
  check("correo").isEmail().custom((correo, { req }) =>
    helpersEmpleado.correoExisteExceptoPropio(correo, req.params.id)
  ),
  validarCampos
], httpEmpleado.putEmpleado);

router.put("/activar/:id", [
  validarJWT,
  check("id", "ID inválido").isMongoId(),
  check("id").custom(helpersEmpleado.validarExisteId),
  validarCampos
], httpEmpleado.activarEmpleado);

router.put("/desactivar/:id", [
  validarJWT,
  check("id", "ID inválido").isMongoId(),
  check("id").custom(helpersEmpleado.validarExisteId),
  validarCampos
], httpEmpleado.desactivarEmpleado);

export default router;
