const { listaProductos } = require("../data/database");

function midCrearProducto(req, res, next) {
    if (req.body.precio === null || req.body.precio === undefined) {
        res.status(406).json("Precio inválido");
    } else if (req.body.nombre === null || req.body.nombre === undefined) {
        res.status(406).json("Nombre inválido");
    } else if (req.body.descripcion === null || req.body.descripcion === undefined) {
        res.status(406).json("Descripción inválida");
    } else if (req.body.img === null || req.body.img === undefined) {
        res.status(406).json("Imagen inválida");
    } else {
        return next();
    }
} 

function midIdProducto(req, res, next) {
    if (Number(req.params.idProducto) < 1 || Number(req.params.idProducto) > listaProductos.length) {
        res.status(406).json("Id de producto inválido");
    } else {
        return next();
    }
}

module.exports = {
    midCrearProducto,
    midIdProducto
}