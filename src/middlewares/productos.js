const { Producto } = require("../database/models/productos");

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

function midIdProducto(req, res, next) {
    if (Number(req.params.idProducto) < 1) {
        res.status(406).json("Id de producto inválido");
    } else {
        return next();
    }
}

module.exports = {
    midCrearProducto,
    midIdProducto
}