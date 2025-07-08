import Usuario from "../models/usuario.js";
const helpersUsuario = {
  // Verificar si ya existe el correo
  emailExiste: async (email = '') => {
    const existe = await Usuario.findOne({ email });
    if (existe) {
      throw new Error(`El correo ${email} ya está registrado`);
    }
  },

  // Validar si el ID existe
  validarExistaId: async (id = '') => {
    const existe = await Usuario.findById(id);
    if (!existe) {
      throw new Error(`No existe un usuario con el ID ${id}`);
    }
  },

  // Permitir actualizar su propio correo si no cambia a uno ya usado
  emailExisteExceptoPropio: async (email, id) => {
    const existe = await Usuario.findOne({ email });
    if (existe && existe._id.toString() !== id) {
      throw new Error(`Ya existe un usuario con ese correo`);
    }
  }


}
export default helpersUsuario