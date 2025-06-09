import mongoose from "mongoose";

const nominaSchema = new mongoose.Schema({
  fechaPago: { type: Date, default: Date.now },
  salarioBase: { type: Number, required: true, min: 0 },
  bonificaciones: { type: Number, default: 0, min: 0 },
  deducciones: { type: Number, default: 0, min: 0 },
  inasistencias: { type: Number, default: 0, min: 0 },
  totalPagado: { type: Number, required: true, min: 0 },
  metodoPago: { type: String, required: true, enum: ['Efectivo', 'Transferencia', 'Otro'], trim: true },
  observaciones: { type: String, trim: true },
  empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', required: true }
}, {
  timestamps: true
});

export default mongoose.model("Nomina", nominaSchema);
