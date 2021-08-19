const { Pago } = require('../database/models/mediosdepago');

function midCrearMedioPago(req, res, next) {
    if (req.body.nombre === null || req.body.nombre === undefined) {
        res.status(401).json("Ingrese nombre de medio de pago");
    } else {
        return next();
    }
}

async function midMetodoPago(req, res, next) {
    try {
        const p = await Pago.find();
        if (Number(req.body.metodoPago) < 1 || Number(req.body.metodoPago) > p.length) {
            res.status(406).json("Metodo de pago inválido");
        } else if (req.body.metodoPago === null || req.body.metodoPago === undefined) {
            res.status(406).json("Ingrese método de pago");
        } else {
            return next();
        }
    } catch {
        res.status(404).json(`Se produjo un error`);
    }
}

async function midIdPago(req, res, next) {
    try {
        const p = await Pago.find();
        if (Number(req.params.idPago) < 1 || Number(req.params.idPago) > p.length) {
            res.status(406).json("Id de medio de pago inválido");
        } else {
            return next();
        }
    } catch {
        res.status(404).json(`Se produjo un error`);
    }
}

module.exports = {
    midCrearMedioPago,
    midMetodoPago,
    midIdPago
}