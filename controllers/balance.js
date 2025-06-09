import BalanceMensual from "../models/BalanceMensual.js";

const httpBalanceMensual = {
  
  // Obtener todos los balances ordenados por fecha descendente
  getBalances: async (req, res) => {
    try {
      const balances = await BalanceMensual.find().sort({ fechaGeneracion: -1 });
      res.json({ balances });
    } catch (error) {
      console.error("Error al obtener balances:", error);
      res.status(500).json({ error: "Error al obtener balances mensuales" });
    }
  },

  // Obtener balance por ID
  getBalanceById: async (req, res) => {
    try {
      const { id } = req.params;
      const balance = await BalanceMensual.findById(id);
      if (!balance) return res.status(404).json({ error: "Balance no encontrado" });
      res.json({ balance });
    } catch (error) {
      console.error("Error al buscar balance:", error);
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear un nuevo balance mensual
  postBalance: async (req, res) => {
    try {
      const { mes, totalVentas, totalGastos, totalNomina } = req.body;

      const gananciaNeta = totalVentas - (totalGastos + totalNomina);

      const nuevoBalance = new BalanceMensual({
        mes,
        totalVentas,
        totalGastos,
        totalNomina,
        gananciaNeta
      });

      await nuevoBalance.save();

      res.status(201).json({ message: "Balance mensual creado con éxito", balance: nuevoBalance });
    } catch (error) {
      console.error("Error al crear balance:", error);
      res.status(400).json({ error: "No se pudo registrar el balance mensual" });
    }
  },

  // Actualizar un balance existente
  putBalance: async (req, res) => {
    try {
      const { id } = req.params;
      const { gananciaNeta, ...resto } = req.body;

      if (!resto.totalVentas || !resto.totalGastos || !resto.totalNomina) {
        return res.status(400).json({ error: "Faltan datos obligatorios para calcular la ganancia neta" });
      }

      const updatedData = {
        ...resto,
        gananciaNeta: resto.totalVentas - (resto.totalGastos + resto.totalNomina)
      };

      const balanceActualizado = await BalanceMensual.findByIdAndUpdate(id, updatedData, { new: true });

      if (!balanceActualizado) return res.status(404).json({ error: "Balance no encontrado" });

      res.json({ message: "Balance actualizado", balance: balanceActualizado });
    } catch (error) {
      console.error("Error al actualizar balance:", error);
      res.status(400).json({ error: "Error al actualizar el balance mensual" });
    }
  },

  // Eliminar un balance mensual (opcional)
  deleteBalance: async (req, res) => {
    try {
      const { id } = req.params;
      const balance = await BalanceMensual.findByIdAndDelete(id);
      if (!balance) return res.status(404).json({ error: "Balance no encontrado" });
      res.json({ message: "Balance eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar balance:", error);
      res.status(500).json({ error: "No se pudo eliminar el balance" });
    }
  }

};

export default httpBalanceMensual;
