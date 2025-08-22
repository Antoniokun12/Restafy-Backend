import { Router } from "express";
import httpPedido from "../controllers/pedido.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import helpersPedido from "../helpers/pedido.js";

const router = Router();

// Listar
router.get("/listar", [validarJWT], httpPedido.getPedidos);

// Por ID
router.get("/listarid/:id", [
    validarJWT,
    check("id").custom(helpersPedido.validarExisteId),
    validarCampos
], httpPedido.getPedidoById);

// Crear
router.post("/crear", [
    // Menú mesero/online puede estar público, pero yo sugiero JWT en panel interno
    validarJWT,
    check("tipoPedido").custom(helpersPedido.validarTipoPedido),
    check("estado").custom(helpersPedido.validarEstado),
    check("detalles").custom(helpersPedido.validarDetalles),
    check("metodoPago").optional().custom(helpersPedido.validarMetodoPago),
    validarCampos
], httpPedido.postPedido);

// Modificar (actualizar items, datos de cliente/mesa, etc.)
router.put("/modificar/:id", [
    validarJWT,
    check("id").custom(helpersPedido.validarExisteId),
    validarCampos
], httpPedido.putPedido);

// Cambiar estado (Preparación/Listo)
router.put("/estado/:id", [
    validarJWT,
    check("id").custom(helpersPedido.validarExisteId),
    check("estado").custom(helpersPedido.validarEstado),
    validarCampos
], httpPedido.cambiarEstado);

// Cerrar (genera venta + factura)
router.post("/cerrar/:id", [
    validarJWT,
    check("id").custom(helpersPedido.validarExisteId),
    check("metodoPago").optional().custom(helpersPedido.validarMetodoPago),
    validarCampos
], httpPedido.cerrarPedido);

export default router;

