import mongoose from "mongoose";

const inventarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  unidad: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true, min: 0 },
  observacion: { type: String, trim: true },
  estado: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model("Inventario", inventarioSchema);
