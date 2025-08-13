import { Router } from "express";
import httpInventario from "../controllers/inventario.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import helpersInventario from "../helpers/inventario.js";

const router = Router();

// Listar todos los inventarios
router.get("/listar", [validarJWT], httpInventario.getInventarios);

// Listar activos e inactivos 
router.get("/listaractivos", [validarJWT], httpInventario.getInventarioactivado);
router.get("/listarinactivos", [validarJWT], httpInventario.getInventariodesactivado);

// Listar por ID
router.get("/listarid/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersInventario.validarExisteId),
  validarCampos
], httpInventario.getInventarioById);

// Crear inventario
router.post("/crear", [
  validarJWT,
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("unidad", "La unidad es obligatoria").notEmpty(),
  check("cantidad", "La cantidad debe ser un número válido").isNumeric(),
  validarCampos
], httpInventario.postInventario);

// Actualizar inventario
router.put("/modificar/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersInventario.validarExisteId),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("unidad", "La unidad es obligatoria").notEmpty(),
  check("cantidad", "La cantidad debe ser numérica").isNumeric(),
  validarCampos
], httpInventario.putInventario);

// Activar inventario
router.put("/activar/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersInventario.validarExisteId),
  validarCampos
], httpInventario.activarInventario);

// Desactivar inventario
router.put("/desactivar/:id", [
  validarJWT,
  check("id", "ID no válido").isMongoId(),
  check("id").custom(helpersInventario.validarExisteId),
  validarCampos
], httpInventario.desactivarInventario);

export default router;
