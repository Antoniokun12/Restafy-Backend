import mongoose from "mongoose";

const balanceMensualSchema = new mongoose.Schema({
  mes: { type: String, required: true, trim: true },
  fechaGeneracion: { type: Date, default: Date.now },
  totalVentas: { type: Number, required: true, min: 0 },
  totalGastos: { type: Number, required: true, min: 0 },
  totalNomina: { type: Number, required: true, min: 0 },
  gananciaNeta: { type: Number, required: true, min: 0 }
}, {
  timestamps: true
});

export default mongoose.model("BalanceMensual", balanceMensualSchema);
