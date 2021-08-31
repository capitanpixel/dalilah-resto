const { Usuario } = require("../database/models/usuarios");
const { Pedido } = require("../database/models/pedidos");
const { Producto } = require("../database/models/productos");
const { Pago } = require("../database/models/mediosdepago");

function midCrearProducto(req, res, next) {
    if (req.body.precio === null || req.body.precio === undefined) {
        res.status(406).json("Precio inválido");
    } else if (req.body.nombre === null || req.body.nombre === undefined) {
        res.status(406).json("Nombre inválido");
    } else if (req.body.descripcion === null || req.body.descripcion === undefined) {
        res.status(406).json("Descripción inválida");
    } else {
        return next();
    }
}

async function midIdUsuario(req, res, next) {
    const usuarios = await Usuario.find();
    for (u of usuarios) {
        if (u.id === Number(req.params.idUsuario)) {
            return next();
        }
    }
    res.status(401).json(`Id de Usuario inválido`);
}

async function midIdPedido(req, res, next) {
    const pedidos = await Pedido.find();
    for (p of pedidos) {
        if (p.id === Number(req.params.idPedido)) {
            return next();
        }
    }
    res.status(401).json(`Id de Pedido inválido`);
}

async function midIdProducto(req, res, next) {
    const productos = await Producto.find();
    for (p of productos) {
        if (p.id === Number(req.params.idProducto)) {
            return next();
        }
    }
    res.status(401).json(`Id de Producto inválido`);
}

async function midIdPago(req, res, next) {
    const pagos = await Pago.find();
    for (p of pagos) {
        if (p.id === Number(req.params.idPago)) {
            return next();
        }
    }
    res.status(401).json(`Id de Pago inválido`);
}

module.exports = {
    midCrearProducto,
    midIdPago,
    midIdPedido,
    midIdProducto,
    midIdUsuario
}
