import Inventario from "../models/Inventario.js";

const httpInventario = {

  // Obtener todos los registros de inventario
  getInventarios: async (req, res) => {
    try {
      const inventarios = await Inventario.find().sort({ createdAt: -1 });
      res.json({ inventarios });
    } catch (error) {
      console.error("Error al obtener inventarios:", error);
      res.status(500).json({ error: "Error al obtener inventarios" });
    }
  },

  // Obtener inventarios por estado (activos o inactivos)
  getInventariosByEstado: async (req, res) => {
    try {
      const { estado } = req.params;
      const inventarios = await Inventario.find({ estado: estado === "true" });
      res.json({ inventarios });
    } catch (error) {
      console.error("Error al filtrar inventarios por estado:", error);
      res.status(500).json({ error: "Error al filtrar inventarios" });
    }
  },

  // Obtener inventario por ID
  getInventarioById: async (req, res) => {
    try {
      const { id } = req.params;
      const inventario = await Inventario.findById(id);
      if (!inventario) return res.status(404).json({ error: "Inventario no encontrado" });
      res.json({ inventario });
    } catch (error) {
      console.error("Error al buscar inventario:", error);
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear nuevo inventario
  postInventario: async (req, res) => {
    try {
      const data = req.body;
      const nuevo = new Inventario(data);
      await nuevo.save();
      res.status(201).json({ message: "Inventario registrado", inventario: nuevo });
    } catch (error) {
      console.error("Error al registrar inventario:", error);
      res.status(400).json({ error: "No se pudo registrar el inventario" });
    }
  },

  // Actualizar inventario
  putInventario: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...dataActualizada } = req.body;
      const inventario = await Inventario.findByIdAndUpdate(id, dataActualizada, { new: true });
      if (!inventario) return res.status(404).json({ error: "Inventario no encontrado" });
      res.json({ message: "Inventario actualizado", inventario });
    } catch (error) {
      console.error("Error al actualizar inventario:", error);
      res.status(400).json({ error: "No se pudo actualizar el inventario" });
    }
  },

  // Activar inventario
  activarInventario: async (req, res) => {
    try {
      const { id } = req.params;
      const inventario = await Inventario.findByIdAndUpdate(id, { estado: true }, { new: true });
      if (!inventario) return res.status(404).json({ error: "Inventario no encontrado" });
      res.json({ message: "Inventario activado", inventario });
    } catch (error) {
      res.status(500).json({ error: "No se pudo activar el inventario" });
    }
  },

  // Desactivar inventario
  desactivarInventario: async (req, res) => {
    try {
      const { id } = req.params;
      const inventario = await Inventario.findByIdAndUpdate(id, { estado: false }, { new: true });
      if (!inventario) return res.status(404).json({ error: "Inventario no encontrado" });
      res.json({ message: "Inventario desactivado", inventario });
    } catch (error) {
      res.status(500).json({ error: "No se pudo desactivar el inventario" });
    }
  }

};

export default httpInventario;
