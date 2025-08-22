// Usa la capitalización real del archivo (Producto.js o producto.js)
import Producto from "../models/producto.js";

const httpProducto = {
  // Listar todos
  getProductos: async (_req, res) => {
    try {
      const productos = await Producto.find().sort({ createdAt: -1 });
      res.json({ productos });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  },

  // Disponibles
  getProductosDisponibles: async (_req, res) => {
    try {
      const productos = await Producto.find({ disponible: true }).sort({ nombre: 1 });
      res.json({ productos });
    } catch {
      res.status(500).json({ error: "Error al obtener productos disponibles" });
    }
  },

  // No disponibles
  getProductosNoDisponibles: async (_req, res) => {
    try {
      const productos = await Producto.find({ disponible: false }).sort({ nombre: 1 });
      res.json({ productos });
    } catch {
      res.status(500).json({ error: "Error al obtener productos no disponibles" });
    }
  },

  // Por ID
  getProductoById: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findById(id);
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ producto });
    } catch {
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear
  postProducto: async (req, res) => {
    try {
      const data = req.body;
      const nuevo = await Producto.create(data);

      // Emitir evento para refrescar menús
      req.io?.emit("producto:disponibilidad", {
        action: "created",
        productoId: nuevo._id,
        disponible: nuevo.disponible,
      });

      res.status(201).json({ message: "Producto registrado con éxito", producto: nuevo });
    } catch (error) {
      console.error("Error al registrar producto:", error);
      res.status(400).json({ error: "No se pudo registrar el producto" });
    }
  },

  // Actualizar
  putProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;
      const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

      // Emitir evento (por si se cambió disponibilidad u otros datos)
      req.io?.emit("producto:disponibilidad", {
        action: "updated",
        productoId: producto._id,
        disponible: producto.disponible,
      });

      res.json({ message: "Producto actualizado correctamente", producto });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({ error: "No se pudo actualizar el producto" });
    }
  },

  // Activar
  activarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByIdAndUpdate(id, { disponible: true }, { new: true });
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

      // emite evento
      req.io?.emit("producto:disponibilidad", {
        productoId: String(producto._id),
        disponible: true,
      });

      res.json({ message: "Producto activado", producto });
    } catch (error) {
      res.status(500).json({ error: "No se pudo activar el producto" });
    }
  },

  desactivarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByIdAndUpdate(id, { disponible: false }, { new: true });
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

      // emite evento
      req.io?.emit("producto:disponibilidad", {
        productoId: String(producto._id),
        disponible: false,
      });

      res.json({ message: "Producto desactivado", producto });
    } catch (error) {
      res.status(500).json({ error: "No se pudo desactivar el producto" });
    }
  },
};

export default httpProducto;
