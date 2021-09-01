const mongoose = require("mongoose");

const schemaUsuario = new mongoose.Schema({
    id: Number,
    nombreUsuario: String,
    nombreApellido: String,
    agenda: Array,
    email: String,
    telefono: String,
    password: String,
    login: Boolean,
    suspendido: Boolean
})

const Usuario = new mongoose.model("Usuario", schemaUsuario);

module.exports = {
    Usuario
}