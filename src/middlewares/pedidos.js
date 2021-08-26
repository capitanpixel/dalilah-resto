const { Pedido } = require('../database/models/pedidos');
const { Usuario } = require('../database/models/usuarios');


function midModificarPedido(req, res, next) {
    try {
        if (Number(req.body.estado) < 1 || Number(req.body.estado) > 5) {
            res.status(406).json("Estado de pedido inválido");
        } else if (req.body.estado === null || req.body.estado === undefined) {
            res.status(406).json("Ingrese estado del pedido");
        } else {
            return next();
        }
    } catch {
        res.status(404).json(`Se produjo un error`);
    }
}

async function midIdPedido(req, res, next) {
    try {
        const p = await Pedido.find();
        if (Number(req.params.idPedido) < 1 || Number(req.params.idPedido > p.length)) {
            res.status(406).json("Id de pedido inválido");
        } else {
            return next();
        }
    } catch {
        res.status(404).json(`Se produjo un error`);
    }
}

module.exports = {
    midModificarPedido,
    midIdPedido
}