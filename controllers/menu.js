import Producto from "../models/producto.js";

const httpMenu = {
    // Menú para cualquier canal (mesero / online)
    getDisponibles: async (_req, res) => {
        try {
            const productos = await Producto.find({ disponible: true }).sort({ nombre: 1 });
            res.json({ productos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el menú" });
        }
    }
};

export default httpMenu;
