const express = require("express");
const { Pago } = require("../database/models/mediosdepago");
const { Pedido } = require("../database/models/pedidos");
const { Producto } = require("../database/models/productos");
const { Usuario } = require("../database/models/usuarios");
const { midMetodoPago } = require("../middlewares/mediosdepago");
const { midIdPedido, midModificarPedido } = require("../middlewares/pedidos");
const { midIdProducto } = require("../middlewares/productos");
const { authAdmin } = require("../middlewares/usuarios");
const routerPedidos = express();


routerPedidos.post("/pedidos", async (req, res) => {
    try {
        const p = await Pedido.find();
        const nuevoPedido = new Pedido();
        //const idUsuario = Number(req.headers.usuarioId);
        if (p.length === 0) {
            nuevoPedido.id = 1;
        } else {
            nuevoPedido.id = p[p.length - 1].id + 1;
        }
        nuevoPedido.estado = 1;
        nuevoPedido.hora = new Date();
        nuevoPedido.descripcion = [];
        nuevoPedido.usuarioId = Number(req.headers.usuarioId);
        nuevoPedido.montoPago = 0;
        await nuevoPedido.save();
        res.status(200).json(`Pedido guardado`);
    } catch (error) {
        console.log(error);
        res.status(401).json(`El pedido no ha podido guardarse`);
    }
})

routerPedidos.post("/pedidos/:idPedido", midMetodoPago, async (req, res) => {
    try {
        //const idUsuario = req.headers.usuarioId;
        const idPedido = Number(req.params.idPedido);
        const p = await Pedido.findOne({ id: idPedido });
        const u = await Usuario.findOne({ id: req.headers.usuarioId });
        const m = await Pago.findOne({ id: req.body.metodoPago});
        if (p.estado = 1) {
            p.metodoPago = m.nombre;
            p.direccion = u.direccion;
            p.estado = 2;
            await p.save();
            res.status(200).json(`El pedido ${p.id} ha sido abonado`);
        } else {
            res.status(404).json(`El pedido ya ha sido abonado anteriormente.`);
        }
    } catch(error) {
        console.log(error);
        res.status(404).json(`El pedido no ha podido ser abonado`);
    }
})

routerPedidos.post("/pedidos/:idPedido/:idProducto", midIdPedido, midIdProducto, async (req, res) => {
    try {
        const usuarioId = Number(req.headers.usuarioId);
        const idPedido = Number(req.params.idPedido);
        const pedido = await Pedido.findOne({ id: idPedido }).exec();
        if (usuarioId === pedido.usuarioId) {
            if (pedido.estado = 1) {
                const idProducto = Number(req.params.idProducto);
                const producto = await Producto.findOne({ id: idProducto }).exec();
                pedido.descripcion.push(producto);
                pedido.montoPago += producto.precio;
                await pedido.save();
                res.status(200).json(`Producto agregado`);
            } else {
                res.status(200).json(`El pedido ya ha sido abonado y no puede modificarse`)
            }
        } else {
            res.status(404).json(`El pedido ${pedido.id} no corresponde al usuario ${usuarioId}`);
        }
    } catch(error) {
        console.log(error);
        res.status(404).json(`No se pudo agregar el producto`);
    }
})

routerPedidos.delete("/pedidos/:idPedido/:idProducto", midIdPedido, midIdProducto, async (req, res) => {
    try {
        const idPedido = Number(req.params.idPedido);
        const pedido = await Pedido.findOne({ id: idPedido }).exec();
        if (pedido.estado = 1) {
            const idProducto = Number(req.params.idProducto);
            const producto = await Producto.findOne({ id: idProducto }).exec();
            let productoIndex = pedido.descripcion.indexOf(producto);
            pedido.descripcion.splice(productoIndex, 1);
            pedido.montoPago -= producto.precio;
            await pedido.save();
            res.status(200).json(`Producto eliminado del pedido`);
        } else {
            res.status(200).json(`El pedido ya ha sido abonado y no puede modificarse`)
        }
    } catch {
        res.status(404).json(`No se pudo eliminar el producto`);
    }
})

routerPedidos.use("/", authAdmin);

routerPedidos.get("/pedidos", async (req, res) => {
    try {
        const p = await Pedido.find();
        res.status(200).json(p);
    } catch {
        res.status(404).json(`No pudieron cargarse los pedidos`);
    }
})

routerPedidos.put("/pedidos/:idPedido", midIdPedido, midModificarPedido, async (req, res) => {
    try {
        const idPedido = Number(req.params.idPedido);
        const p = await Pedido.findOne({ id: idPedido }).exec();
        p.estado = req.body.estado;
        p.save();
        res.status(200).json(`El pedido ha sido modificado a estado ${p.estado}`);
    } catch {
        res.status(404).json(`El pedido no ha podido modificarse`);
    }
})

routerPedidos.delete("/pedidos/:idPedido", midIdPedido, async (req, res) => {
    try {
        const idPedido = Number(req.params.idPedido);
        const p = await Pedido.deleteOne({ id: idPedido });
        res.status(200).json(`El pedido ${p.id} ha sido eliminado`);
    } catch {
        res.status(404).json(`El pedido no ha podido ser eliminado`);
    }
})

module.exports = {
    routerPedidos
}