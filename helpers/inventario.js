import Inventario from "../models/inventario.js";

const helpersInventario = {
  // Verifica si un ID existe
  validarExisteId: async (id = "") => {
    const existe = await Inventario.findById(id);
    if (!existe) {
      throw new Error(`No existe un inventario con el ID ${id}`);
    }
  }
};

export default helpersInventario;
