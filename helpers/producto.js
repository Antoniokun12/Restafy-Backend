import Producto from "../models/producto.js";

const helpersProducto = {
  validarExisteId: async (id = "") => {
    const existe = await Producto.findById(id);
    if (!existe) {
      throw new Error(`No existe un producto con el ID ${id}`);
    }
  }
};

export default helpersProducto;
