const express = require("express");
const routerProductos = express();
const { Producto } = require("../database/models/productos");

routerProductos.get("/productos", async (req, res) => {
    try {
        const p = await Producto.find();
        res.status(200).json(p);
    } catch {
        res.status(404).json(`No se han podido cargar los productos`);
    }
})

routerProductos.post("/productos", async (req, res) => {
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

routerProductos.put("/productos/:idProducto", async (req, res) => {
    try {
        const p = await Producto.findOne({ id: req.params.idProducto });
        p.precio = req.body.precio;
        p.descripcion = req.body.descripcion;
        p.save();
        res.status(200).json(`El producto ${p.nombre} ha sido modificado`);
    } catch {
        res.status(404).json(`No se pudo modificar el producto`);
    }
})

routerProductos.delete("/productos/:idProducto", async (req, res) => {
    try {
        const p = await Producto.deleteOne({ id: req.params.idProducto });
        res.status(200).json(`El producto ha sido eliminado`);
    } catch {
        res.status(404).json(`No se ha podido eliminar el producto`);
    }
})

module.exports = {
    routerProductos
}