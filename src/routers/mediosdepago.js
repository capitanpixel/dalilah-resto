const { Router } = require("express");
const { midIdPago } = require("../middlewares/middlewares");
const { authAdmin } = require("../middlewares/auth");
const { Pago } = require("../database/models/mediosdepago");

function makePagosRouter() {

    const router = Router();

    // ver medios de pago
    router.get("/mediosdepago", authAdmin, async (req, res) => {
        try {
            const m = await Pago.find();
            res.status(200).json(m);
        } catch {
            res.status(400).json(`Error al cargar los medios de pago`);
        }
    })

    // crear medio de pago
    router.post("/mediosdepago", authAdmin, async (req, res) => {
        try {
            if (req.body.nombre === null || req.body.nombre === undefined) {
                res.status(400).json("Ingrese nombre de medio de pago");
            } else {
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
            }
        } catch {
            res.status(400).json(`Error al cargar el medio de pago`);
        }
    })

    // modificar medio de pago
    router.put("/mediosdepago/:idPago", authAdmin, midIdPago, async (req, res) => {
        try {
            if (req.body.nombre === null || req.body.nombre === undefined) {
                res.status(400).json("Ingrese nombre de medio de pago");
            } else {
                const idPago = Number(req.params.idPago);
                const p = await Pago.findOne({ id: idPago });
                p.nombre = req.body.nombre;
                await p.save();
                res.status(200).json(`El medio de pago ${p.nombre} ha sido modificado`);
            }
        } catch {
            res.status(400).json(`Error al modificar medio de pago`);
        }
    })

    // eliminar medio de pago
    router.delete("/mediosdepago/:idPago", authAdmin, midIdPago, async (req, res) => {
        try {
            const idPago = Number(req.params.idPago);
            await Pago.deleteOne({ id: idPago });
            res.status(200).json(`El medio de pago ha sido eliminado`);
        } catch {
            res.status(400).json(`Error al eliminar medio de pago`);
        }
    })

    return router;
}

module.exports = {
    makePagosRouter
}