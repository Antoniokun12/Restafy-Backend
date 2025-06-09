import Pedido from "../models/Pedido.js";

const httpPedido = {

  // Obtener todos los pedidos
  getPedidos: async (req, res) => {
    try {
      const pedidos = await Pedido.find().sort({ createdAt: -1 });
      res.json({ pedidos });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      res.status(500).json({ error: "Error al obtener los pedidos" });
    }
  },

  // Obtener pedido por ID
  getPedidoById: async (req, res) => {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findById(id);
      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
      res.json({ pedido });
    } catch (error) {
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear nuevo pedido
  postPedido: async (req, res) => {
    try {
      const {
        tipoPedido,
        estado,
        metodoPago,
        mesaAsignada,
        clienteNombre,
        clienteTelefono,
        direccionEntrega,
        detalles
      } = req.body;

      // Calcular total
      const total = detalles.reduce((sum, item) => sum + item.subtotal, 0);

      const nuevoPedido = new Pedido({
        tipoPedido,
        estado,
        metodoPago,
        mesaAsignada,
        clienteNombre,
        clienteTelefono,
        direccionEntrega,
        detalles,
        total
      });

      await nuevoPedido.save();

      res.status(201).json({ message: "Pedido creado exitosamente", pedido: nuevoPedido });
    } catch (error) {
      console.error("Error al registrar pedido:", error);
      res.status(400).json({ error: "No se pudo registrar el pedido" });
    }
  },

  // Actualizar pedido
  putPedido: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;

      // Si actualiza los detalles, recalcula el total
      if (data.detalles && Array.isArray(data.detalles)) {
        data.total = data.detalles.reduce((sum, item) => sum + item.subtotal, 0);
      }

      const pedidoActualizado = await Pedido.findByIdAndUpdate(id, data, { new: true });

      if (!pedidoActualizado) return res.status(404).json({ error: "Pedido no encontrado" });

      res.json({ message: "Pedido actualizado", pedido: pedidoActualizado });
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      res.status(400).json({ error: "No se pudo actualizar el pedido" });
    }
  },

  // Cambiar estado del pedido
  cambiarEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!['Preparación', 'Listo'].includes(estado)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      const pedido = await Pedido.findByIdAndUpdate(id, { estado }, { new: true });

      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

      res.json({ message: "Estado actualizado", pedido });
    } catch (error) {
      res.status(500).json({ error: "Error al cambiar el estado del pedido" });
    }
  }

};

export default httpPedido;
