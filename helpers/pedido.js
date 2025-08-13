import Pedido from "../models/Pedido.js";

const helpersPedido = {
    // Verifica si un ID existe
    validarExisteId: async (id = "") => {
        const existe = await Pedido.findById(id);
        if (!existe) {
            throw new Error(`No existe un pedido con el ID ${id}`);
        }
    }
};

export default helpersPedido;
