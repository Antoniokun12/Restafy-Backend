import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String, required: true, select: false}, // Para que no se devuelva por defecto en las consultas
  rol: {type: String, enum: ['Administrador', 'Mesero', 'Cocinero', 'Cajero', 'Contador'], required: true},
  estado:{type:Number, default:1}
}, {
  timestamps: true
});

export default mongoose.model("Usuario", usuarioSchema);
