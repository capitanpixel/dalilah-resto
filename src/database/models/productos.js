const mongoose = require("mongoose");

const schemaProducto = new mongoose.Schema({
    id: Number,
    precio: Number,
    nombre: String,
    descripcion: String
})

const Producto = new mongoose.model("Producto", schemaProducto);

module.exports = {
    Producto
}