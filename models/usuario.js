import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {type: String, required: true, trim: true},
  correo: {type: String, required: true, unique: true, lowercase: true},
  contraseña: {type: String, required: true, select: false}, // Para que no se devuelva por defecto en las consultas
  rol: {type: String, enum: ['Administrador', 'Mesero', 'Cocinero', 'Cajero', 'Contador'], required: true},
  estado: {type: Boolean, default: true}
}, {
  timestamps: true
});

export default mongoose.model("Usuario", usuarioSchema);
