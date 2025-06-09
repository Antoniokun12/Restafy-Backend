import Nomina from "../models/Nomina.js";

const httpNomina = {

  // Obtener todas las nóminas
  getNominas: async (req, res) => {
    try {
      const nominas = await Nomina.find().populate("empleadoId", "nombre cargo").sort({ fechaPago: -1 });
      res.json({ nominas });
    } catch (error) {
      console.error("Error al obtener nóminas:", error);
      res.status(500).json({ error: "Error al obtener las nóminas" });
    }
  },

  // Obtener nómina por ID
  getNominaById: async (req, res) => {
    try {
      const { id } = req.params;
      const nomina = await Nomina.findById(id).populate("empleadoId", "nombre cargo");
      if (!nomina) return res.status(404).json({ error: "Nómina no encontrada" });
      res.json({ nomina });
    } catch (error) {
      console.error("Error al obtener nómina:", error);
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear una nueva nómina
  postNomina: async (req, res) => {
    try {
      const { fechaPago, salarioBase, bonificaciones = 0, deducciones = 0, inasistencias = 0, metodoPago, observaciones, empleadoId } = req.body;

      const totalPagado = salarioBase + bonificaciones - deducciones;

      const nuevaNomina = new Nomina({
        fechaPago,
        salarioBase,
        bonificaciones,
        deducciones,
        inasistencias,
        totalPagado,
        metodoPago,
        observaciones,
        empleadoId
      });

      await nuevaNomina.save();
      res.status(201).json({ message: "Nómina registrada con éxito", nomina: nuevaNomina });
    } catch (error) {
      console.error("Error al registrar nómina:", error);
      res.status(400).json({ error: "No se pudo registrar la nómina" });
    }
  },

  // Actualizar una nómina
  putNomina: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, totalPagado, ...datos } = req.body;

      const recalculado = datos.salarioBase + (datos.bonificaciones || 0) - (datos.deducciones || 0);

      const nominaActualizada = await Nomina.findByIdAndUpdate(
        id,
        { ...datos, totalPagado: recalculado },
        { new: true }
      );

      if (!nominaActualizada) return res.status(404).json({ error: "Nómina no encontrada" });

      res.json({ message: "Nómina actualizada correctamente", nomina: nominaActualizada });
    } catch (error) {
      console.error("Error al actualizar nómina:", error);
      res.status(400).json({ error: "No se pudo actualizar la nómina" });
    }
  },

  // Eliminar una nómina (opcional)
  deleteNomina: async (req, res) => {
    try {
      const { id } = req.params;
      const nomina = await Nomina.findByIdAndDelete(id);
      if (!nomina) return res.status(404).json({ error: "Nómina no encontrada" });
      res.json({ message: "Nómina eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar nómina:", error);
      res.status(500).json({ error: "Error al eliminar la nómina" });
    }
  }

};

export default httpNomina;
