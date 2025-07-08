import Empleado from "../models/empleado.js";

const helpersEmpleado = {
  documentoExiste: async (documento = '') => {
    const existe = await Empleado.findOne({ documento });
    if (existe) throw new Error(`El documento ${documento} ya está registrado`);
  },

  correoExiste: async (correo = '') => {
    const existe = await Empleado.findOne({ correo });
    if (existe) throw new Error(`El correo ${correo} ya está registrado`);
  },

  validarExisteId: async (id = '') => {
    const existe = await Empleado.findById(id);
    if (!existe) throw new Error(`No existe un empleado con ID ${id}`);
  },

  correoExisteExceptoPropio: async (correo, id) => {
    const existe = await Empleado.findOne({ correo });
    if (existe && existe._id.toString() !== id) {
      throw new Error(`Ya existe otro empleado con ese correo`);
    }
  }
};

export default helpersEmpleado;
