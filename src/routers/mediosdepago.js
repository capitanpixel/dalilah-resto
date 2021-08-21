const express = require("express");
const { Pago } = require("../database/models/mediosdepago");
const { midCrearMedioPago, midIdPago } = require("../middlewares/mediosdepago");
const { authAdmin } = require("../middlewares/usuarios");
const routerPagos = express();

//routerPagos.use("/", authAdmin);
// ver medios de pago
routerPagos.get("/mediosdepago", authAdmin, async (req, res) => {
    try {
        const m = await Pago.find();
        res.status(200).json(m);
    } catch {
        res.status(404).json(`Error al cargar los medios de pago`);
    }
})
// crear medio de pago
routerPagos.post("/mediosdepago", authAdmin, midCrearMedioPago, async (req, res) => {
    try {
        const m = await Pago.find();
        const nuevoPago = await new Pago();
        if (m.length === 0) {
            nuevoPago.id = 1;
        } else {
            nuevoPago.id = m[m.length - 1].id + 1;
        }
        nuevoPago.nombre = req.body.nombre;
        await nuevoPago.save();
        res.status(200).json(`El medio de pago ${nuevoPago.nombre} ha sido agregado`);
    } catch (error) {
        console.log(error);
        res.status(404).json(`Error al cargar el medio de pago`);
    }
})
// modificar medio de pago
routerPagos.put("/mediosdepago/:idPago", authAdmin, midIdPago, midCrearMedioPago, async (req, res) => {
    try {
        const idPago = Number(req.params.idPago);
        const p = await Pago.findOne({ id: idPago });
        p.nombre = req.body.nombre;
        await p.save();
        res.status(200).json(`El medio de pago ${p.nombre} ha sido modificado`);
    } catch {
        res.status(404).json(`Error al modificar medio de pago`);
    }
})
// eliminar medio de pago
routerPagos.delete("/mediosdepago/:idPago", authAdmin, midIdPago, async (req, res) => {
    try {
        const idPago = Number(req.params.idPago);
        const m = await Pago.deleteOne({ id: idPago});
        res.status(200).json(`El medio de pago ha sido eliminado`);
    } catch {
        res.status(404).json(`Error al eliminar medio de pago`);
    }
})

module.exports = {
    routerPagos
}