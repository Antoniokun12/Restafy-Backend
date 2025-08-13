import Producto from "../models/producto.js";

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

  // Obtener productos disponibles
  getProductosDisponibles: async (req, res) => {
    try {
      const productos = await Producto.find({ disponible: true }).sort({ nombre: 1 });
      res.json({ productos });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener productos disponibles" });
    }
  },

  // Obtener productos NO disponibles
  getProductosNoDisponibles: async (req, res) => {
    try {
      const productos = await Producto.find({ disponible: false }).sort({ nombre: 1 });
      res.json({ productos });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener productos no disponibles" });
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

  // Activar producto
  activarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByIdAndUpdate(id, { disponible: true }, { new: true });
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ message: "Producto activado", producto });
    } catch (error) {
      res.status(500).json({ error: "No se pudo activar el producto" });
    }
  },

  // Desactivar producto
  desactivarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByIdAndUpdate(id, { disponible: false }, { new: true });
      if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ message: "Producto desactivado", producto });
    } catch (error) {
      res.status(500).json({ error: "No se pudo desactivar el producto" });
    }
  }

};

export default httpProducto;
