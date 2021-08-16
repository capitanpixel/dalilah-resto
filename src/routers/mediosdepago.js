const express = require("express");
const routerPagos = express();
const { Pago } = require("../database/models/mediosdepago")

routerPagos.get("/mediosdepago", async (req, res) => {
    try {
        const m = await Pago.find();
        res.status(200).json(m);
    } catch {
        res.status(404).json(`Error al cargar los medios de pago`);
    }
})

routerPagos.post("/mediosdepago", async (req, res) => {
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

routerPagos.put("/mediosdepago/:idPago", async (req, res) => {

    try {
        const p = await Pago.findOne({ id: req.params.id });
        p.nombre = req.body.nombre;
        await p.save();
        res.status(200).json(`El medio de pago ha sido modificado`);
    } catch {
        res.status(404).json(`Error al modificar medio de pago`);
    }
})

routerPagos.delete("/mediosdepago/:idPago", async (req, res) => {
    try {
        const m = await Pago.deleteOne({ id: req.params.idPago});
        res.status(200).json(`El medio de pago ha sido eliminado`);
    } catch {
        res.status(404).json(`Error al eliminar medio de pago`);
    }
})

module.exports = {
    routerPagos
}