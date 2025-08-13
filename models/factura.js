import mongoose from "mongoose";

const detalleFacturaSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  nombreProducto: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true, min: 1 },
  precioUnitario: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const facturaSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  metodoPago: { type: String, required: true, enum: ['efectivo', 'tarjeta', 'en_linea'], trim: true },
  total: { type: Number, required: true, min: 0 },
  clienteNombre: { type: String, required: true, trim: true },
  clienteTelefono: { type: String, required: true, trim: true },
  pedidoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
  detalles: { type: [detalleFacturaSchema], required: true }
}, {
  timestamps: true
});

export default mongoose.model("Factura", facturaSchema);
