import Usuario from "../models/usuario.js";
import bcryptjs from "bcryptjs";
import { generarJWT, generarTokenReset, validarTokenReset } from "../middlewares/validar-jwt.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';


const httpUsuario = {

  // Obtener todos los usuarios
  getUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.find().sort({ createdAt: -1 });
      res.json({ usuarios });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  },

  // Obtener usuarios por estado (activo)
  getUsuariosactivado: async (req, res) => {
    try {
      const activados = await Usuario.find({ estado: 1 }).sort({ _id: -1 });
      res.json({ activados });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener Administrador activado' });
    }
  },

  // Obtener usuarios por estado (desactivado)
  getUsuariosdesactivado: async (req, res) => {
    try {
      const desactivados = await Usuario.find({ estado: 0 }).sort({ _id: -1 });
      res.json({ desactivados })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener Administrador desactivado' });
    }
  },

  // Obtener usuario por ID
  getUsuarioById: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ usuario });
    } catch (error) {
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear nuevo usuario
  postUsuario: async (req, res) => {
    try {
      const data = req.body;

      // 1. Validar que venga la contraseña
      if (!data.password) {
        return res.status(400).json({ error: "El password es obligatorio" });
      }

      // 2. Encriptar la contraseña
      const salt = bcryptjs.genSaltSync(10);
      data.password = bcryptjs.hashSync(data.password, salt);

      // 3. Crear el usuario
      const nuevoUsuario = new Usuario(data);
      await nuevoUsuario.save();

      // 4. Eliminar el password del objeto antes de enviarlo como respuesta
      const { password, ...usuarioSinPassword } = nuevoUsuario.toObject();
      res.status(201).json({ message: "Usuario creado con éxito", usuario: usuarioSinPassword });

    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(400).json({ error: "No se pudo registrar el usuario" });
    }
  },

  // Login 
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Usuario.findOne({ email }).select("+password");
      if (!user || user.estado === 0) {
        return res.status(401).json({ msg: "Usuario / Password no son correctos" });
      }
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ msg: "Usuario / Password no son correctos" });
      }
      const token = await generarJWT(user.id);
      res.json({ usuario: user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Hable con el WebMaster" });
    }
  },

  // Actualizar usuario
  putUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, password, ...data } = req.body;

      const usuarioActualizado = await Usuario.findByIdAndUpdate(id, data, { new: true });
      if (!usuarioActualizado) return res.status(404).json({ error: "Usuario no encontrado" });

      res.json({ message: "Usuario actualizado", usuario: usuarioActualizado });
    } catch (error) {
      res.status(400).json({ error: "No se pudo actualizar el usuario" });
    }
  },

  // Activar usuario
  activarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByIdAndUpdate(id, { estado: true }, { new: true });
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ message: "Usuario activado", usuario });
    } catch (error) {
      res.status(500).json({ error: "No se pudo activar el usuario" });
    }
  },

  // Desactivar usuario
  desactivarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ message: "Usuario desactivado", usuario });
    } catch (error) {
      res.status(500).json({ error: "No se pudo desactivar el usuario" });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(404).json({
          msg: "Usuario no encontrado"
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetPasswordToken = await generarTokenReset(usuario.id, resetToken);
      // const resetLink = `http://localhost:4500/api/usuario/reset-password/${resetPasswordToken}`;
      const resetLink = `https://restafy.netlify.app/#/reset-password?token=${resetPasswordToken}`;

      const message = `
            <h1>Recuperación de Contraseña</h1>
            <p>Por favor, haga clic en el siguiente enlace para restablecer su contraseña:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este enlace expirará en 2 horas.</p>
        `;

      await sendEmail(usuario.email, "Recuperación de Contraseña", message);
      res.json({
        msg: "Correo de recuperación enviado"
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Error interno del servidor"
      });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden"
      });
    }

    try {
      const { id } = validarTokenReset(token);

      const salt = bcryptjs.genSaltSync();
      const hashedPassword = bcryptjs.hashSync(newPassword, salt);

      await Usuario.findByIdAndUpdate(id, { password: hashedPassword });

      res.json({
        msg: "Contraseña restablecida exitosamente"
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Error interno del servidor"
      });
    }
  }

};

export default httpUsuario;
