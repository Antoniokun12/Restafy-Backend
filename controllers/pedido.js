import Pedido from "../models/pedido.js";
import Venta from "../models/venta.js";
import Factura from "../models/factura.js";

const httpPedido = {
  // Listar
  getPedidos: async (_req, res) => {
    try {
      const pedidos = await Pedido.find().sort({ createdAt: -1 });
      res.json({ pedidos });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      res.status(500).json({ error: "Error al obtener los pedidos" });
    }
  },

  // Obtener por ID
  getPedidoById: async (req, res) => {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findById(id);
      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
      res.json({ pedido });
    } catch {
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear
  postPedido: async (req, res) => {
    try {
      const {
        tipoPedido,
        estado,
        metodoPago,         // obligatorio SOLO si es Domicilio (valídalo en frontend)
        mesaAsignada,
        clienteNombre,
        clienteTelefono,
        direccionEntrega,
        detalles
      } = req.body;

      if (!Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({ error: "El pedido debe contener detalles" });
      }

      const total = detalles.reduce((sum, it) => sum + (Number(it.subtotal) || 0), 0);

      const nuevoPedido = await Pedido.create({
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

      // Notificación por socket
      req.io?.emit?.("pedido:nuevo", { pedido: nuevoPedido });

      res.status(201).json({ message: "Pedido creado exitosamente", pedido: nuevoPedido });
    } catch (error) {
      console.error("Error al registrar pedido:", error);
      res.status(400).json({ error: "No se pudo registrar el pedido" });
    }
  },

  // Actualizar
  putPedido: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;

      if (data.detalles && Array.isArray(data.detalles)) {
        data.total = data.detalles.reduce((sum, it) => sum + (Number(it.subtotal) || 0), 0);
      }

      const pedido = await Pedido.findByIdAndUpdate(id, data, { new: true });
      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

      res.json({ message: "Pedido actualizado", pedido });
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      res.status(400).json({ error: "No se pudo actualizar el pedido" });
    }
  },

  // Cambiar estado
  cambiarEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!['Preparación', 'Listo'].includes(estado)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      const pedido = await Pedido.findByIdAndUpdate(id, { estado }, { new: true });
      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

      req.io?.emit?.("pedido:estado", { pedidoId: pedido._id, estado });

      res.json({ message: "Estado actualizado", pedido });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      res.status(500).json({ error: "Error al cambiar el estado del pedido" });
    }
  },

  // Cerrar (generar Venta y Factura)
  cerrarPedido: async (req, res) => {
    try {
      const { id } = req.params;
      let { metodoPago, clienteNombre, clienteTelefono } = req.body;

      // Normalizar método de pago (enum: 'efectivo','tarjeta','en_linea')
      const METODOS = ['efectivo', 'tarjeta', 'en_linea'];
      if (!metodoPago || !METODOS.includes(metodoPago)) {
        return res.status(400).json({ error: "Método de pago inválido" });
      }

      const pedido = await Pedido.findById(id);
      if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

      // Normalizar nombre/teléfono
      clienteNombre = (clienteNombre || '').trim();
      clienteTelefono = (clienteTelefono || '').trim();

      if (pedido.tipoPedido === 'Mesa') {
        if (!clienteNombre) clienteNombre = `Mesa ${pedido.mesaAsignada ?? ''}`.trim();
        if (!clienteTelefono) clienteTelefono = 'N/A';
      } else {
        // Domicilio requiere nombre y teléfono
        if (!clienteNombre || !clienteTelefono) {
          return res.status(400).json({ error: "Nombre y teléfono son obligatorios para Domicilio" });
        }
      }

      // Guardar datos finales en pedido
      pedido.metodoPago = metodoPago;   // queda seteado
      pedido.estado = "Listo";          // por si no lo estaba
      // (Opcional) persistir nombre/teléfono si quieres mantenerlos consistentes
      if (clienteNombre) pedido.clienteNombre = clienteNombre;
      if (clienteTelefono) pedido.clienteTelefono = clienteTelefono;

      await pedido.save();

      // Crear Venta
      const venta = await new Venta({
        fecha: new Date(),
        tipoPedido: pedido.tipoPedido,   // 'Mesa' | 'Domicilio'
        metodoPago,                      // enum en minúsculas
        total: pedido.total,
        clienteNombre: clienteNombre,
        pedidoId: pedido._id
      }).save();

      // Crear Factura (detalles desde pedido)
      const detallesFactura = (pedido.detalles || []).map(d => ({
        productoId: d.productoId,
        nombreProducto: d.nombreProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }));

      const factura = await new Factura({
        fecha: new Date(),
        metodoPago,
        total: pedido.total,
        clienteNombre,
        clienteTelefono,
        pedidoId: pedido._id,
        detalles: detallesFactura
      }).save();

      // Notificar por socket
      req.io?.emit?.("pedido:cerrado", { pedidoId: pedido._id, venta, factura });

      res.json({
        message: "Pedido cerrado. Venta y factura generadas.",
        pedido,
        venta,
        factura
      });
    } catch (error) {
      console.warn(error);
      res.status(500).json({ error: "No se pudo cerrar el pedido" });
    }
  }
};

export default httpPedido;
