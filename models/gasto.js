import mongoose from "mongoose";

const gastoSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  descripcion: { type: String, required: true, trim: true },
  monto: { type: Number, required: true, min: 0 },
  metodoPago: { type: String, required: true, enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Otro'], trim: true },
  usuarioid: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  observaciones: { type: String, trim: true }
}, {
  timestamps: true
});

export default mongoose.model("Gasto", gastoSchema);
