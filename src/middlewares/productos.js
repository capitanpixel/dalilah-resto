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

async function midIdProducto(req, res, next) {
    try {
        const p = await Producto.find();
        if (Number(req.params.idProducto) < 1 || Number(req.params.idProducto) > p.length) {
            res.status(406).json("Id de producto inválido");
        } else {
            return next();
        }
    } catch {
        res.status(404).json(`Se produjo un error`);
    }
}

module.exports = {
    midCrearProducto,
    midIdProducto
}