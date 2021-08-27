const { Router } = require("express");
const mongoose = require("mongoose");
const db = mongoose.connection;
const { Pago } = require("../database/models/mediosdepago");
const { Pedido } = require("../database/models/pedidos");
const { Producto } = require("../database/models/productos");
const { Usuario } = require("../database/models/usuarios");
const { authAdmin, midLogin } = require("../middlewares/middlewares");

function makePedidosRouter() {

    const router = Router();

    // crear pedido
    router.post("/pedidos", midLogin, async (req, res) => {
        try {
            const p = await Pedido.find();
            const nuevoPedido = new Pedido();
            if (p.length === 0) {
                nuevoPedido.id = 1;
            } else {
                nuevoPedido.id = p[p.length - 1].id + 1;
            }
            nuevoPedido.estado = 1;
            nuevoPedido.hora = new Date();
            nuevoPedido.descripcion = [];
            nuevoPedido.usuarioId = Number(req.headers.userid);
            nuevoPedido.montoPago = 0;
            await nuevoPedido.save();
            res.status(200).json(`Pedido ${nuevoPedido.id} creado`);
        } catch {
            res.status(401).json(`El pedido no ha podido guardarse`);
        }
    })

    // pagar pedido
    router.post("/pedidos/:idPedido", midLogin, async (req, res) => {
        try {
            const idUsuario = Number(req.headers.userid);
            const idPedido = Number(req.params.idPedido);
            const idDireccion = Number(req.body.direccion);
            const pedidos = await Pedido.find();
            const p = await Pedido.findOne({ id: idPedido });
            const u = await Usuario.findOne({ id: idUsuario });
            const m = await Pago.findOne({ id: req.body.metodoPago });
            if (idPedido > 0 && idPedido <= pedidos.length) {
                const session = await db.startSession();
                session.startTransaction();
                if (idUsuario === p.usuarioId) {
                    if (p.estado === 1) {
                        p.metodoPago = m.nombre;
                        p.direccion = u.agenda[idDireccion - 1];
                        p.estado = 2;
                        await p.save();
                        await session.commitTransaction();
                        res.status(200).json(`El pedido ${p.id} ha sido abonado`);
                    } else {
                        await session.abortTransaction();
                        res.status(404).json(`El pedido ${p.id} ya ha sido abonado anteriormente.`);
                    }
                } else {
                    await session.abortTransaction();
                    res.status(404).json(`El pedido ${pedido.id} no corresponde al usuario ${u.nombreUsuario}`);
                }
                session.endSession();
            } else {
                res.status(404).json(`Id de pedido inválido`);
            }
        } catch(error) {
            console.log(error);
            res.status(404).json(`El pedido no ha podido ser abonado`);
        }
    })

    // agregar producto al pedido
    router.post("/pedidos/:idPedido/:idProducto", midLogin, async (req, res) => {
        try {
            const usuarioId = Number(req.headers.userid);
            const idPedido = Number(req.params.idPedido);
            const idProducto = Number(req.params.idProducto);
            const u = await Usuario.findOne({ id: usuarioId });
            const pedido = await Pedido.findOne({ id: idPedido }).exec();
            const producto = await Producto.findOne({ id: idProducto }).exec();
            const pedidos = await Pedido.find();
            const productos = await Producto.find();
            if (idPedido > 0 && idPedido <= pedidos.length) {
                if (idProducto > 0 && idProducto <= productos.length) {
                    const session = await db.startSession();
                    session.startTransaction();
                    if (usuarioId === pedido.usuarioId) {
                        if (pedido.estado === 1) {
                            pedido.descripcion.push(producto);
                            pedido.montoPago += producto.precio;
                            await pedido.save();
                            await session.commitTransaction();
                            res.status(200).json(`Producto ${producto.nombre} agregado al pedido ${pedido.id}`);
                        } else {
                            await session.abortTransaction();
                            res.status(200).json(`El pedido ${pedido.id} ya ha sido abonado y no puede modificarse`)
                        }
                    } else {
                        await session.abortTransaction();
                        res.status(404).json(`El pedido ${pedido.id} no corresponde al usuario ${u.nombreUsuario}`);
                    }
                    session.endSession();

                } else {
                    res.status(404).json(`Id del producto inválido`);
                }
            } else {
                res.status(404).json(`Id del pedido inválido`);
            }
        } catch {
            res.status(404).json(`No se pudo agregar el producto`);
        }
    })

    // quitar producto del pedido
    router.delete("/pedidos/:idPedido/:idProducto", midLogin, async (req, res) => {
        try {
            const usuarioId = Number(req.headers.userid);
            const idPedido = Number(req.params.idPedido);
            const idProducto = Number(req.params.idProducto);
            const u = await Usuario.findOne({ id: usuarioId });
            const pedido = await Pedido.findOne({ id: idPedido }).exec();
            const producto = await Producto.findOne({ id: idProducto }).exec();
            const pedidos = await Pedido.find();
            const productos = await Producto.find();
            if (idPedido > 0 && idPedido <= pedidos.length) {
                if (idProducto > 0 && idProducto <= productos.length) {
                    const session = await db.startSession();
                    session.startTransaction();
                    if (usuarioId === pedido.usuarioId) {
                        if (pedido.estado === 1) {
                            let productoIndex = pedido.descripcion.indexOf(producto);
                            pedido.descripcion.splice(productoIndex, 1);
                            pedido.montoPago -= producto.precio;
                            await pedido.save();
                            await session.commitTransaction();
                            res.status(200).json(`Producto ${producto.nombre} eliminado del pedido ${pedido.id}`);
                        } else {
                            await session.abortTransaction();
                            res.status(200).json(`El pedido ${pedido.id} ya ha sido abonado y no puede modificarse`)
                        }
                    } else {
                        await session.abortTransaction();
                        res.status(404).json(`El pedido ${pedido.id} no corresponde al usuario ${u.nombreUsuario}`);
                    }
                    session.endSession();
                } else {
                    res.status(404).json(`Id del producto inválido`);
                }
            } else {
                res.status(404).json(`Id del pedido inválido`);
            }
        } catch {
            res.status(404).json(`No se pudo quitar el producto`);
        }
    })

    // ver pedidos
    router.get("/pedidos", authAdmin, midLogin, async (req, res) => {
        try {
            const p = await Pedido.find();
            res.status(200).json(p);
        } catch {
            res.status(404).json(`No pudieron cargarse los pedidos`);
        }
    })
    
    //modificar pedido
    router.put("/pedidos/:idPedido", authAdmin, midLogin, async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const pedidos = await Pedido.find();
            if (idPedido > 0 && idPedido <= pedidos.length) {
                const p = await Pedido.findOne({ id: idPedido }).exec();
                if (req.body.estado > 1 && req.body.estado < 5) {
                    p.estado = req.body.estado;
                    p.save();
                    res.status(200).json(`El pedido ${p.id} ha sido modificado a estado ${p.estado}`);
                } else {
                    res.status(404).json(`Estado de pedido inválido`);
                }
            } else {
                res.status(404).json(`Id del pedido inválido`);
            }
        } catch {
            res.status(404).json(`El pedido ${p.id} no ha podido modificarse`);
        }
    })
    // eliminar pedido
    router.delete("/pedidos/:idPedido", authAdmin, midLogin, async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const pedidos = await Pedido.find();
            if (idPedido > 0 && idPedido <= pedidos.length) {
                const p = await Pedido.deleteOne({ id: idPedido });
                res.status(200).json(`El pedido ha sido eliminado`);
            } else {
                res.status(404).json(`Id del pedido inválido`);
            }
        } catch {
            res.status(404).json(`El pedido no ha podido ser eliminado`);
        }
    })
    return router;
}

module.exports = {
    makePedidosRouter
}