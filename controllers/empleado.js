import Empleado from "../models/Empleado.js";

const httpEmpleado = {

  // Obtener todos los empleados
  getEmpleados: async (req, res) => {
    try {
      const empleados = await Empleado.find().sort({ createdAt: -1 });
      res.json({ empleados });
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      res.status(500).json({ error: "Error al obtener empleados" });
    }
  },

  // Obtener empleados activos/inactivos
  getEmpleadosByEstado: async (req, res) => {
    try {
      const { estado } = req.params; // true o false
      const empleados = await Empleado.find({ estado: estado === "true" });
      res.json({ empleados });
    } catch (error) {
      res.status(500).json({ error: "Error al filtrar empleados por estado" });
    }
  },

  // Obtener empleado por ID
  getEmpleadoById: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findById(id);
      if (!empleado) return res.status(404).json({ error: "Empleado no encontrado" });
      res.json({ empleado });
    } catch (error) {
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear empleado
  postEmpleado: async (req, res) => {
    try {
      const datos = req.body;
      const nuevoEmpleado = new Empleado(datos);
      await nuevoEmpleado.save();
      res.status(201).json({ message: "Empleado creado correctamente", empleado: nuevoEmpleado });
    } catch (error) {
      console.error("Error al crear empleado:", error);
      res.status(400).json({ error: "No se pudo registrar el empleado" });
    }
  },

  // Actualizar empleado
  putEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...dataActualizada } = req.body;
      const empleado = await Empleado.findByIdAndUpdate(id, dataActualizada, { new: true });
      if (!empleado) return res.status(404).json({ error: "Empleado no encontrado" });
      res.json({ message: "Empleado actualizado", empleado });
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar el empleado" });
    }
  },

  // Activar empleado
  activarEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findByIdAndUpdate(id, { estado: true }, { new: true });
      if (!empleado) return res.status(404).json({ error: "Empleado no encontrado" });
      res.json({ message: "Empleado activado", empleado });
    } catch (error) {
      res.status(500).json({ error: "No se pudo activar el empleado" });
    }
  },

  // Desactivar empleado
  desactivarEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findByIdAndUpdate(id, { estado: false }, { new: true });
      if (!empleado) return res.status(404).json({ error: "Empleado no encontrado" });
      res.json({ message: "Empleado desactivado", empleado });
    } catch (error) {
      res.status(500).json({ error: "No se pudo desactivar el empleado" });
    }
  }

};

export default httpEmpleado;
