const express = require("express");
const routerProductos = express();
const { Producto } = require("../database/models/productos");
const { midCrearProducto, midIdProducto } = require("../middlewares/productos");
const { authAdmin } = require("../middlewares/usuarios");
// ver productos
routerProductos.get("/productos", async (req, res) => {
    try {
        const p = await Producto.find();
        res.status(200).json(p);
    } catch {
        res.status(404).json(`No se han podido cargar los productos`);
    }
})

routerProductos.use("/", authAdmin);
// crear productos
routerProductos.post("/productos", midCrearProducto, async (req, res) => {
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
        res.status(200).json(`Producto guardado`);
    } catch (error) {
        console.log(error);
    }
})
// modificar producto
routerProductos.put("/productos/:idProducto", midCrearProducto, async (req, res) => {
    try {
        const idProducto = Number(req.params.idProducto);
        const p = await Producto.findOne({ id: idProducto });
        p.precio = req.body.precio;
        p.descripcion = req.body.descripcion;
        p.save();
        res.status(200).json(`El producto ${p.nombre} ha sido modificado`);
    } catch {
        res.status(404).json(`No se pudo modificar el producto`);
    }
})
// eliminar producto
routerProductos.delete("/productos/:idProducto", midIdProducto, async (req, res) => {
    try {
        const idProducto = Number(req.params.idProducto);
        const p = await Producto.deleteOne({ id: idProducto });
        res.status(200).json(`El producto ha sido eliminado`);
    } catch {
        res.status(404).json(`No se ha podido eliminar el producto`);
    }
})

module.exports = {
    routerProductos
}