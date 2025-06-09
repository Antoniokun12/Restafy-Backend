import Usuario from "../models/Usuario.js";

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

  // Obtener usuarios por estado (activos/inactivos)
  getUsuariosByEstado: async (req, res) => {
    try {
      const { estado } = req.params;
      const usuarios = await Usuario.find({ estado: estado === "true" });
      res.json({ usuarios });
    } catch (error) {
      res.status(500).json({ error: "Error al filtrar usuarios" });
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

      // En producción, se recomienda **encriptar la contraseña** antes de guardar:
      // data.contraseña = await bcrypt.hash(data.contraseña, 10);

      const nuevoUsuario = new Usuario(data);
      await nuevoUsuario.save();

      // Por seguridad, no se envía la contraseña
      const { contraseña, ...usuarioSinPass } = nuevoUsuario.toObject();
      res.status(201).json({ message: "Usuario creado con éxito", usuario: usuarioSinPass });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(400).json({ error: "No se pudo registrar el usuario" });
    }
  },

  // Actualizar usuario
  putUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, contraseña, ...data } = req.body;

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
  }
};

export default httpUsuario;
