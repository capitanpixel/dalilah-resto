const { Router } = require("express");
const redis = require("redis");
const { Producto } = require("../database/models/productos");
const { midCrearProducto, midIdProducto } = require("../middlewares/productos");
const { authAdmin } = require("../middlewares/usuarios");

const client = redis.createClient();
client.on("error", function (error) {
    console.error(error);
})

function makeProductosRouter() {
    const router = Router();
    // ver productos
    router.get("/productos", async (req, res) => {
        try {
            client.get("productos", (error, rep) => {
                if(error) {
                    res.json(error);
                }
                if(rep) {
                    res.json(rep);
                }
            });
            const p = await Producto.find();
            client.set("productos", JSON.stringify(p));
            res.status(200).json(p);
        } catch {
            res.status(404).json(`No se han podido cargar los productos`);
        }
    })

    // crear productos
    router.post("/productos", authAdmin, midCrearProducto, async (req, res) => {
        try {
            const p = await Producto.find();
            const nuevoProducto = new Producto();
            if (p.length === 0) {
                nuevoProducto.id = 1;
            } else {
                nuevoProducto.id = p[p.length - 1].id + 1;
            }
            nuevoProducto.nombre = req.body.nombre;
            nuevoProducto.precio = req.body.precio;
            nuevoProducto.descripcion = req.body.descripcion;
            await nuevoProducto.save();
            res.status(200).json(`El producto "${nuevoProducto.nombre}" ha sido creado`);
        } catch {
            res.status(404).json(`No se ha podido crear el producto`);
        }
    })
    // modificar producto
    router.put("/productos/:idProducto", authAdmin, async (req, res) => {
        try {
            const idProducto = Number(req.params.idProducto);
            const p = await Producto.findOne({ id: idProducto });
            p.precio = req.body.precio;
            p.save();
            const productos = await Producto.find();
            client.set("productos", JSON.stringify(productos));
            res.status(200).json(`El producto ${p.nombre} ha sido modificado`);
        } catch {
            res.status(404).json(`No se pudo modificar el producto`);
        }
    })
    // eliminar producto
    router.delete("/productos/:idProducto", authAdmin, midIdProducto, async (req, res) => {
        try {
            const idProducto = Number(req.params.idProducto);
            const p = await Producto.deleteOne({ id: idProducto });
            res.status(200).json(`El producto ha sido eliminado`);
        } catch {
            res.status(404).json(`No se ha podido eliminar el producto`);
        }
    })
    return router;
}

module.exports = {
    makeProductosRouter
}