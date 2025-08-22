import { Router } from "express";
import httpMenu from "../controllers/menu.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

// Si el menú público NO requiere login, puedes quitar validarJWT del online:
const router = Router();

// Menú para panel interno (meseros) protegido
router.get("/disponibles", [validarJWT], httpMenu.getDisponibles);

// Opción pública (si quieres menú sin JWT para clientes):
router.get("/online/disponibles", httpMenu.getDisponibles);

export default router;
