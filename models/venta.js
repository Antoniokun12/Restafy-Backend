import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  tipoPedido: { type: String, required: true, enum: ['Mesa', 'Domicilio'], trim: true },
  metodoPago: { type: String, required: true, enum: ['Efectivo', 'Tarjeta', 'EnLinea'], trim: true },
  total: { type: Number, required: true, min: 0 },
  clienteNombre: { type: String, trim: true },
  pedidoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true }
}, {
  timestamps: true
});

export default mongoose.model("Venta", ventaSchema);
