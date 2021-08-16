const { Pedido } = require('../database/models/pedidos');

function midModificarPedido(req, res, next) {
    if (Number(req.body.estado) < 1 || Number(req.body.estado) > 5) {
        res.status(406).json("Estado de pedido inválido");
    } else if (req.body.estado === null || req.body.estado === undefined) {
        res.status(406).json("Ingrese estado del pedido");
    } else {
        return next();
    }
}

function midIdPedido(req, res, next) {
    const p = Pedido.find();
    if (Number(req.params.idPedido) < 1 || Number(req.params.idPedido) > p.length) {
        res.status(406).json("Id de pedido inválido");
    } else {
        return next();
    }
}

module.exports = {
    midModificarPedido,
    midIdPedido
}