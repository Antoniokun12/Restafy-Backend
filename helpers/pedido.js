import mongoose from "mongoose";

const tiposPedido = ['Mesa', 'Domicilio'];
const estados = ['Preparación', 'Listo'];
const metodos = ['efectivo', 'tarjeta', 'en_linea'];

const helpersPedido = {
    validarExisteId: async (id = '') => {
        if (!mongoose.isValidObjectId(id)) throw new Error('ID no válido');
        // La existencia la validamos en el controlador para no hacer doble query si no hace falta.
    },
    validarTipoPedido: (tipo) => {
        if (!tiposPedido.includes(tipo)) throw new Error('tipoPedido inválido');
        return true;
    },
    validarEstado: (estado) => {
        if (!estados.includes(estado)) throw new Error('estado inválido');
        return true;
    },
    validarMetodoPago: (metodo) => {
        if (metodo && !metodos.includes(metodo)) throw new Error('metodoPago inválido');
        return true;
    },
    validarDetalles: (detalles) => {
        if (!Array.isArray(detalles) || detalles.length === 0) {
            throw new Error('detalles es obligatorio y debe tener al menos 1 ítem');
        }
        for (const d of detalles) {
            if (!d.productoId || !mongoose.isValidObjectId(d.productoId)) throw new Error('productoId inválido');
            if (typeof d.cantidad !== 'number' || d.cantidad < 1) throw new Error('cantidad inválida');
            if (typeof d.precioUnitario !== 'number' || d.precioUnitario < 0) throw new Error('precioUnitario inválido');
            if (typeof d.subtotal !== 'number' || d.subtotal < 0) throw new Error('subtotal inválido');
        }
        return true;
    }
};

export default helpersPedido;
