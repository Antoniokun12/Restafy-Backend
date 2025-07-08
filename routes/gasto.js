import { Router } from "express";
import httpGasto from "../controllers/gasto.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import helpersGasto from "../helpers/gasto.js";

const router = Router();

// Listar todos los gastos
router.get("/listar", [validarJWT], httpGasto.getGastos);

// Obtener gasto por ID
router.get("/listarid/:id", [
  validarJWT,
  check("id", "ID inválido").isMongoId(),
  check("id").custom(helpersGasto.validarExisteId),
  validarCampos
], httpGasto.getGastoById);

// Crear gasto
router.post("/crear", [
  validarJWT,
  check("descripcion", "La descripción es obligatoria").notEmpty(),
  check("monto", "El monto debe ser un número positivo").isFloat({ min: 0 }),
  check("metodoPago").isIn(['Efectivo', 'Transferencia', 'Tarjeta', 'Otro']).withMessage("Método de pago inválido"),
  check("usuarioid", "Debe ser un ID válido").isMongoId(),
  validarCampos
], httpGasto.postGasto);

// Modificar gasto
router.put("/modificar/:id", [
  validarJWT,
  check("id", "ID inválido").isMongoId(),
  check("id").custom(helpersGasto.validarExisteId),
  validarCampos
], httpGasto.putGasto);

// Eliminar gasto (opcional)
router.delete("/eliminar/:id", [
  validarJWT,
  check("id", "ID inválido").isMongoId(),
  check("id").custom(helpersGasto.validarExisteId),
  validarCampos
], httpGasto.deleteGasto);

export default router;
