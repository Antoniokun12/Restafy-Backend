import Producto from "../models/Producto.js";

const httpProducto = {

  // Obtener todos los productos
  getProductos: async (req, res) => {
    try {
      const productos = await Producto.find().sort({ createdAt: -1 });
      res.json({ productos });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  },

  // Obtener productos por disponibilidad
  getProductosDisponibles: async (req, res) => {
    try {
      const productos = await Producto.find({ disponible: true }).sort({ nombre: 1 });
      res.json({ productos });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener productos disponibles" });
    }
  },

  // Obtener producto por ID
  getProductoById: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findById(id);
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ producto });
    } catch (error) {
      res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
  },

  // Crear nuevo producto
  postProducto: async (req, res) => {
    try {
      const data = req.body;
      const nuevoProducto = new Producto(data);
      await nuevoProducto.save();
      res.status(201).json({ message: "Producto registrado con éxito", producto: nuevoProducto });
    } catch (error) {
      console.error("Error al registrar producto:", error);
      res.status(400).json({ error: "No se pudo registrar el producto" });
    }
  },

  // Actualizar producto
  putProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id, ...data } = req.body;
      const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ message: "Producto actualizado correctamente", producto });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({ error: "No se pudo actualizar el producto" });
    }
  },

  // Cambiar disponibilidad
  cambiarDisponibilidad: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findById(id);
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
      producto.disponible = !producto.disponible;
      await producto.save();
      res.json({ message: `Producto ${producto.disponible ? 'activado' : 'desactivado'}`, producto });
    } catch (error) {
      res.status(500).json({ error: "No se pudo cambiar la disponibilidad del producto" });
    }
  }

};

export default httpProducto;
