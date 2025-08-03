import Empleado from "../models/empleado.js";

const httpEmpleado = {
  // Listar todos los empleados
  getEmpleados: async (req, res) => {
    try {
      const empleados = await Empleado.find().sort({ createdAt: -1 });
      res.json({ empleados });
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      res.status(500).json({ error: "Error al obtener empleados" });
    }
  },

  // Listar empleados activos
  getEmpleadosActivos: async (req, res) => {
    try {
      const activados = await Empleado.find({ estado: true }).sort({ createdAt: -1 });
      res.json( activados );
    } catch (error) {
      res.status(500).json({ error: "Error al obtener empleados activos" });
    }
  },

  // Listar empleados inactivos
  getEmpleadosInactivos: async (req, res) => {
    try {
      const desactivados = await Empleado.find({ estado: false }).sort({ createdAt: -1 });
      res.json({ desactivados });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener empleados inactivos" });
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
      const data = req.body;
      const nuevoEmpleado = new Empleado(data);
      await nuevoEmpleado.save();
      res.status(201).json({ message: "Empleado creado", empleado: nuevoEmpleado });
    } catch (error) {
      console.error("Error al crear empleado:", error);
      res.status(400).json({ error: "No se pudo registrar el empleado" });
    }
  },

  // Modificar empleado
  putEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;
      const actualizado = await Empleado.findByIdAndUpdate(id, data, { new: true });
      if (!actualizado) return res.status(404).json({ error: "Empleado no encontrado" });
      res.json({ message: "Empleado actualizado", empleado: actualizado });
    } catch (error) {
      res.status(400).json({ error: "No se pudo actualizar el empleado" });
    }
  },

  // Activar empleado
  activarEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findByIdAndUpdate(id, { estado: true }, { new: true });
      res.json({ message: "Empleado activado", empleado });
    } catch (error) {
      res.status(500).json({ error: "Error al activar el empleado" });
    }
  },

  // Desactivar empleado
  desactivarEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findByIdAndUpdate(id, { estado: false }, { new: true });
      res.json({ message: "Empleado desactivado", empleado });
    } catch (error) {
      res.status(500).json({ error: "Error al desactivar el empleado" });
    }
  }
};

export default httpEmpleado;

