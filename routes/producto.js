import { Router } from "express";
import httpProducto from "../controllers/producto.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import helpersProducto from "../helpers/producto.js";

const router = Router();

// Listar todos los productos
router.get("/listar", [validarJWT], httpProducto.getProductos);

// Listar disponibles e inactivos
router.get("/listar-disponibles", [validarJWT], httpProducto.getProductosDisponibles);
router.get("/listar-no-disponibles", [validarJWT], httpProducto.getProductosNoDisponibles);

// Obtener producto por ID
router.get("/listarid/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersProducto.validarExisteId),
  validarCampos
], httpProducto.getProductoById);

// Crear producto
router.post("/crear", [
  validarJWT,
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("precio", "El precio debe ser numérico").isNumeric(),
  check("tipo", "Tipo inválido").isIn(['comida', 'bebida', 'postre']),
  validarCampos
], httpProducto.postProducto);

// Actualizar producto
router.put("/modificar/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersProducto.validarExisteId),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("precio", "El precio debe ser numérico").isNumeric(),
  check("tipo", "Tipo inválido").isIn(['comida', 'bebida', 'postre']),
  validarCampos
], httpProducto.putProducto);

// Activar producto
router.put("/activar/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersProducto.validarExisteId),
  validarCampos
], httpProducto.activarProducto);

// Desactivar producto
router.put("/desactivar/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersProducto.validarExisteId),
  validarCampos
], httpProducto.desactivarProducto);

export default router;
