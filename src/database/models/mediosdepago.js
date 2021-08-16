const mongoose = require("mongoose");

const schemaPago = new mongoose.Schema({
    id: Number,
    nombre: String,
})

const Pago = new mongoose.model("Pago", schemaPago);

module.exports = {
    Pago
}