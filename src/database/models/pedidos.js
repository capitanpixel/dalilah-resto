const mongoose = require("mongoose");

const schemaPedido = new mongoose.Schema({
    id: Number,
    estado: Number,
    hora: Date,
    descripcion: Array,
    metodoPago: String,
    montoPago: Number,
    usuarioId: Number,
    direccion: String
})

const Pedido = new mongoose.model("Pedido", schemaPedido);

module.exports = {
    Pedido
}