import { Router } from "express";
import httpUsuario from "../controllers/usuario.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import helpersUsuario from "../helpers/usuario.js"; // Aquí colocarás tus validaciones personalizadas

const router = Router();

// Obtener todos los usuarios
router.get("/listar", [validarJWT], httpUsuario.getUsuarios);

// Obtener usuarios por estado (activos/inactivos)
router.get("/listaractivos", [validarJWT], httpUsuario.getUsuariosactivado);
router.get("/listarinactivos", [validarJWT], httpUsuario.getUsuariosdesactivado);

// Obtener usuario por ID
router.get("/listarid/:id", [
  validarJWT,
  check("id", "No es un ID válido").isMongoId(),
  check("id").custom(helpersUsuario.validarExistaId),
  validarCampos
], httpUsuario.getUsuarioById);

// Crear usuario
router.post("/crear", [
  validarJWT,
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("email", "El correo no es válido").isEmail(),
  check("email").custom(helpersUsuario.emailExiste),
  check("password", "La contraseña es obligatoria y debe tener al menos 6 caracteres").isLength({ min: 6 }),
  check("rol").isIn(['Administrador', 'Mesero', 'Cocinero', 'Cajero', 'Contador']).withMessage('Rol no permitido'),
  validarCampos
], httpUsuario.postUsuario);

// Login 
router.post("/login", [
  check('email', 'El email debe estar bien escrito.').isEmail(),
  validarCampos
], httpUsuario.login)

// Modificar usuario
router.put("/modificar/:id", [
  validarJWT,
  check("id", "No es un ID válido").isMongoId(),
  check("id").custom(helpersUsuario.validarExistaId),
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("email", "El correo debe ser válido").isEmail(),
  check("email").custom((correo, { req }) => helpersUsuario.emailExisteExceptoPropio(correo, req.params.id)),
  check("rol").isIn(['Administrador', 'Mesero', 'Cocinero', 'Cajero', 'Contador']).withMessage('Rol inválido'),
  validarCampos
], httpUsuario.putUsuario);

// Activar usuario
router.put("/activar/:id", [
  validarJWT,
  check("id", "No es un ID válido").isMongoId(),
  check("id").custom(helpersUsuario.validarExistaId),
  validarCampos
], httpUsuario.activarUsuario);

// Desactivar usuario
router.put("/desactivar/:id", [
  validarJWT,
  check("id", "No es un ID válido").isMongoId(),
  check("id").custom(helpersUsuario.validarExistaId),
  validarCampos
], httpUsuario.desactivarUsuario);

// Recuperacion de cuenta 
router.post('/forgot-password', httpUsuario.forgotPassword);
router.post('/reset-password/:token', httpUsuario.resetPassword);

export default router;
