import Venta from "../models/Venta.js";
import Pedido from "../models/Pedido.js";

const httpVenta = {

  // Obtener todas las ventas
  getVentas: async (req, res) => {
    try {
      const ventas = await Venta.find()
        .populate("pedidoId", "tipoPedido estado detalles")
        .sort({ createdAt: -1 });
      res.json({ ventas });
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      res.status(500).json({ error: "Error al obtener las ventas" });
    }
  },

  // Obtener venta por ID
  getVentaById: async (req, res) => {
    try {
      const { id } = req.params;
      const venta = await Venta.findById(id).populate("pedidoId");
      if (!venta) return res.status(404).json({ error: "Venta no encontrada" });
      res.json({ venta });
    } catch (error) {
      console.error("Error al obtener venta:", error);
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear venta a partir de un pedido
  postVenta: async (req, res) => {
    try {
      const { pedidoId, metodoPago, clienteNombre } = req.body;

      const pedido = await Pedido.findById(pedidoId);
      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

      const nuevaVenta = new Venta({
        pedidoId,
        tipoPedido: pedido.tipoPedido,
        metodoPago,
        total: pedido.total,
        clienteNombre
      });

      await nuevaVenta.save();

      res.status(201).json({ message: "Venta registrada con éxito", venta: nuevaVenta });
    } catch (error) {
      console.error("Error al registrar venta:", error);
      res.status(400).json({ error: "No se pudo registrar la venta" });
    }
  },

  // Actualizar una venta (opcional)
  putVenta: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;

      const ventaActualizada = await Venta.findByIdAndUpdate(id, data, { new: true });

      if (!ventaActualizada) return res.status(404).json({ error: "Venta no encontrada" });

      res.json({ message: "Venta actualizada correctamente", venta: ventaActualizada });
    } catch (error) {
      console.error("Error al actualizar venta:", error);
      res.status(400).json({ error: "No se pudo actualizar la venta" });
    }
  },

  // Eliminar una venta (opcional)
  deleteVenta: async (req, res) => {
    try {
      const { id } = req.params;
      const venta = await Venta.findByIdAndDelete(id);
      if (!venta) return res.status(404).json({ error: "Venta no encontrada" });
      res.json({ message: "Venta eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      res.status(500).json({ error: "No se pudo eliminar la venta" });
    }
  }

};

export default httpVenta;
