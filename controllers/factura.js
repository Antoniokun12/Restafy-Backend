import Factura from "../models/Factura.js";
import Pedido from "../models/Pedido.js";

const httpFactura = {

  // Obtener todas las facturas
  getFacturas: async (req, res) => {
    try {
      const facturas = await Factura.find()
        .populate("pedidoId", "tipoPedido total estado")
        .sort({ createdAt: -1 });
      res.json({ facturas });
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      res.status(500).json({ error: "Error al obtener las facturas" });
    }
  },

  // Obtener una factura por ID
  getFacturaById: async (req, res) => {
    try {
      const { id } = req.params;
      const factura = await Factura.findById(id).populate("pedidoId");
      if (!factura) return res.status(404).json({ error: "Factura no encontrada" });
      res.json({ factura });
    } catch (error) {
      console.error("Error al obtener factura:", error);
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear una factura a partir de un pedido
  postFactura: async (req, res) => {
    try {
      const { pedidoId, metodoPago } = req.body;

      const pedido = await Pedido.findById(pedidoId);
      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

      const detalles = pedido.detalles.map(item => ({
        productoId: item.productoId,
        nombreProducto: item.nombreProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal
      }));

      const nuevaFactura = new Factura({
        metodoPago,
        total: pedido.total,
        clienteNombre: pedido.clienteNombre || "N/A",
        clienteTelefono: pedido.clienteTelefono || "N/A",
        pedidoId,
        detalles
      });

      await nuevaFactura.save();

      res.status(201).json({ message: "Factura generada correctamente", factura: nuevaFactura });
    } catch (error) {
      console.error("Error al generar factura:", error);
      res.status(400).json({ error: "No se pudo generar la factura" });
    }
  },

  // Actualizar factura (opcional)
  putFactura: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;
      const factura = await Factura.findByIdAndUpdate(id, data, { new: true });
      if (!factura) return res.status(404).json({ error: "Factura no encontrada" });
      res.json({ message: "Factura actualizada", factura });
    } catch (error) {
      res.status(400).json({ error: "No se pudo actualizar la factura" });
    }
  },

  // Eliminar factura (opcional)
  deleteFactura: async (req, res) => {
    try {
      const { id } = req.params;
      const factura = await Factura.findByIdAndDelete(id);
      if (!factura) return res.status(404).json({ error: "Factura no encontrada" });
      res.json({ message: "Factura eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la factura" });
    }
  }

};

export default httpFactura;
