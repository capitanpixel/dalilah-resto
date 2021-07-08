const { mediosPago } = require('./database.js');

class MedioDePago {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}

function crearMedioPago(req, res) {
    let nuevoMedioPago = new MedioDePago();
    if (mediosPago.length === 0) {
        nuevoMedioPago.id = 1;
    } else {
        nuevoMedioPago.id = mediosPago[mediosPago.length - 1].id + 1 ;
    }
    nuevoMedioPago.nombre = req.body.nombre;
    mediosPago.push(nuevoMedioPago);
    res.status(200).json(`El medio de pago ${nuevoMedioPago.nombre} ha sido agregado.`);
}

function verMedioPago(req, res) {
    res.status(200).json(mediosPago);
}

function eliminarMedioPago(req, res) {
    for (let medio of mediosPago) {
        if (medio.id === Number(req.params.idMedioPago)) {
            let medioIndex = mediosPago.indexOf(medio);
            mediosPago.splice(medioIndex, 1);
            res.status(200).json(`El medio de pago ${medio.nombre} ha sido eliminado.`);
        }
    }
}

function modificarMedioPago(req, res) {
    for (let medio of mediosPago) {
        if (medio.id === Number(req.params.idMedioPago)) {
            medio.nombre = req.body.nombre;
            res.status(200).json(`El medio de pago ${medio.id} ha sido modificado.`);
        }
    }
}

module.exports = {
    crearMedioPago,
    eliminarMedioPago,
    modificarMedioPago,
    verMedioPago,
    MedioDePago
}