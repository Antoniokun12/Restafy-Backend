import Gasto from "../models/gasto.js";

const httpGasto = {
  // Listar todos los gastos
  getGastos: async (req, res) => {
    try {
      const gastos = await Gasto.find().populate("usuarioid", "nombre correo").sort({ createdAt: -1 });
      res.json({ gastos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los gastos" });
    }
  },

  // Obtener gasto por ID
  getGastoById: async (req, res) => {
    try {
      const { id } = req.params;
      const gasto = await Gasto.findById(id).populate("usuarioid", "nombre correo");
      if (!gasto) return res.status(404).json({ error: "Gasto no encontrado" });
      res.json({ gasto });
    } catch (error) {
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear nuevo gasto
  postGasto: async (req, res) => {
    try {
      const data = req.body;
      const nuevoGasto = new Gasto(data);
      await nuevoGasto.save();
      res.status(201).json({ message: "Gasto registrado con éxito", gasto: nuevoGasto });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "No se pudo registrar el gasto" });
    }
  },

  // Modificar gasto
  putGasto: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...resto } = req.body;
      const gastoActualizado = await Gasto.findByIdAndUpdate(id, resto, { new: true });
      if (!gastoActualizado) return res.status(404).json({ error: "Gasto no encontrado" });
      res.json({ message: "Gasto actualizado", gasto: gastoActualizado });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "No se pudo actualizar el gasto" });
    }
  },

  // Eliminar gasto (opcional)
  deleteGasto: async (req, res) => {
    try {
      const { id } = req.params;
      const gasto = await Gasto.findByIdAndDelete(id);
      if (!gasto) return res.status(404).json({ error: "Gasto no encontrado" });
      res.json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "No se pudo eliminar el gasto" });
    }
  }
};

export default httpGasto;
