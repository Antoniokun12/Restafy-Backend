import Gasto from "../models/Gasto.js";

const httpGasto = {

  // Obtener todos los gastos
  getGastos: async (req, res) => {
    try {
      const gastos = await Gasto.find().populate("usuarioid", "nombre correo").sort({ createdAt: -1 });
      res.json({ gastos });
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
      res.status(500).json({ error: "Error al obtener los gastos" });
    }
  },

  // Obtener un gasto por ID
  getGastoById: async (req, res) => {
    try {
      const { id } = req.params;
      const gasto = await Gasto.findById(id).populate("usuarioid", "nombre correo");
      if (!gasto) return res.status(404).json({ error: "Gasto no encontrado" });
      res.json({ gasto });
    } catch (error) {
      console.error("Error al buscar gasto:", error);
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear un nuevo gasto
  postGasto: async (req, res) => {
    try {
      const { fecha, descripcion, monto, metodoPago, usuarioid, observaciones } = req.body;
      const nuevoGasto = new Gasto({ fecha, descripcion, monto, metodoPago, usuarioid, observaciones });
      await nuevoGasto.save();
      res.status(201).json({ message: "Gasto registrado con éxito", gasto: nuevoGasto });
    } catch (error) {
      console.error("Error al crear gasto:", error);
      res.status(400).json({ error: "No se pudo registrar el gasto" });
    }
  },

  // Actualizar un gasto
  putGasto: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;
      const gastoActualizado = await Gasto.findByIdAndUpdate(id, data, { new: true });
      if (!gastoActualizado) return res.status(404).json({ error: "Gasto no encontrado" });
      res.json({ message: "Gasto actualizado", gasto: gastoActualizado });
    } catch (error) {
      console.error("Error al actualizar gasto:", error);
      res.status(400).json({ error: "No se pudo actualizar el gasto" });
    }
  },

  // Eliminar un gasto (opcional)
  deleteGasto: async (req, res) => {
    try {
      const { id } = req.params;
      const gasto = await Gasto.findByIdAndDelete(id);
      if (!gasto) return res.status(404).json({ error: "Gasto no encontrado" });
      res.json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
      res.status(500).json({ error: "Error interno al eliminar gasto" });
    }
  }
};

export default httpGasto;
