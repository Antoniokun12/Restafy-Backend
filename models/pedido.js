import mongoose from "mongoose";

const detalleSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  nombreProducto: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true, min: 1 },
  precioUnitario: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
  observaciones: { type: String, trim: true }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  tipoPedido: { type: String, required: true, enum: ['Mesa', 'Domicilio'], trim: true },
  estado: { type: String, required: true, enum: ['Preparación', 'Listo'], trim: true },
  total: { type: Number, required: true, min: 0 },
  metodoPago: { type: String, enum: ['efectivo', 'tarjeta', 'en linea'], trim: true },
  mesaAsignada: { type: Number },
  clienteNombre: { type: String, trim: true },
  clienteTelefono: { type: String, trim: true },
  direccionEntrega: { type: String, trim: true },
  detalles: { type: [detalleSchema], required: true }
}, {
  timestamps: true
});

export default mongoose.model("Pedido", pedidoSchema);
