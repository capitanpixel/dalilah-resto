const mongoose = require("mongoose");

const schemaUsuario = new mongoose.Schema({
    id: Number,
    nombreUsuario: String,
    nombreApellido: String,
    direccion: String,
    email: String,
    telefono: String,
    password: String,
    login: Boolean,
    isAdmin: Boolean
})

const Usuario = new mongoose.model("Usuario", schemaUsuario);

module.exports = {
    Usuario
}