import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  documento: { type: String, required: true, unique: true, trim: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  fechaNacimiento: { type: Date, required: true },
  fechaContratacion: { type: Date, required: true },
  cargo: { type: String, required: true, trim: true },
  salario: { type: Number, required: true, min: 0 },
  estado: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model("Empleado", empleadoSchema);
