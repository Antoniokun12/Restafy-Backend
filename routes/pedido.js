import { Router } from "express";
import httpPedido from "../controllers/pedido.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import helpersPedido from "../helpers/pedido.js";

const router = Router();

// Listar todos los pedidos
router.get("/listar", [validarJWT], httpPedido.getPedidos);

// Listar pedido por ID
router.get("/listarid/:id", [
    validarJWT,
    check("id", "ID no válido").isMongoId(),
    check("id").custom(helpersPedido.validarExisteId),
    validarCampos
], httpPedido.getPedidoById);

// Crear pedido
router.post("/crear", [
    validarJWT,
    check("tipoPedido", "El tipo de pedido es obligatorio").notEmpty(),
    check("estado", "El estado es obligatorio").notEmpty(),
    check("detalles", "Los detalles del pedido son obligatorios").isArray({ min: 1 }),
    validarCampos
], httpPedido.postPedido);

// Modificar pedido
router.put("/modificar/:id", [
    validarJWT,
    check("id", "ID no válido").isMongoId(),
    check("id").custom(helpersPedido.validarExisteId),
    validarCampos
], httpPedido.putPedido);

// Cambiar estado del pedido
router.put("/estado/:id", [
    validarJWT,
    check("id", "ID no válido").isMongoId(),
    check("id").custom(helpersPedido.validarExisteId),
    check("estado", "Estado inválido").isIn(['Preparación', 'Listo']),
    validarCampos
], httpPedido.cambiarEstado);

export default router;
