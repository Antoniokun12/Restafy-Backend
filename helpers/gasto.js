import Gasto from "../models/gasto.js";

const helpersGasto = {
  validarExisteId: async (id = '') => {
    const existe = await Gasto.findById(id);
    if (!existe) {
      throw new Error(`No existe un gasto con el ID ${id}`);
    }
  }
};

export default helpersGasto;
