import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  foto: { type: String, trim: true },
  precio: { type: Number, required: true, min: 0 },
  tipo: { type: String, required: true, enum: ['comida', 'bebida', 'postre'], trim: true },
  componentes: { type: String, trim: true },
  disponible: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model("Producto", productoSchema);
