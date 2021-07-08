const { listaUsuarios, listaProductos, listaPedidos } = require('./database.js');

class Producto {
    constructor(id, precio, nombre, descripcion, img) {
        this.id = id;
        this.precio = precio;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.img = img;
    }
}

function listarProductos(req, res) {
    res.status(200).json(listaProductos);
}

function crearProducto(req, res) {
    let nuevoProducto = new Producto();
    if (listaProductos.length === 0) {
        nuevoProducto.id = 1;
    } else {
        nuevoProducto.id = listaProductos[listaProductos.length - 1].id +1 ;
    }
    nuevoProducto.precio = req.body.precio;
    nuevoProducto.nombre = req.body.nombre;
    nuevoProducto.descripcion = req.body.descripcion;
    nuevoProducto.img = req.body.img;
    listaProductos.push(nuevoProducto);
    res.status(200).json(`El producto ${nuevoProducto.nombre} ha sido creado con éxito.`);
}

function modificarProducto(req, res) {
    for (let producto of listaProductos) {
        if (producto.id === Number(req.params.idProducto)) {
            producto.precio = req.body.precio;
            producto.nombre = req.body.nombre;
            producto.descripcion = req.body.descripcion;
            producto.img = req.body.img;
            res.status(200).json(`El producto ${producto.nombre} ha sido modificado con éxito.`);
        }
    }
}

function eliminarProducto(req, res) {
    for (let producto of listaProductos) {
        if (producto.id === Number(req.params.idProducto)) {
            let productoIndex = listaProductos.indexOf(producto);
            listaProductos.splice(productoIndex, 1);
            res.status(200).json(`El producto ${producto.nombre} ha sido eliminado.`);
        }
    }
}

function agregarCarrito(req, res) {
    for (let usuario of listaUsuarios) {
        if (usuario.id === Number(req.headers.userid)) {
            for (let pedido of listaPedidos) {
                if (pedido.id === Number(req.params.idPedido) && pedido.usuarioId === usuario.id) {
                    for (let producto of listaProductos) {
                        if (producto.id === Number(req.params.idProducto)) {
                            pedido.descripcion.push(producto);
                            res.status(200).json(`El producto ${producto.nombre} ha sido agregado al pedido ${pedido.id}`);
                            return;
                        }
                    }
                }
            }
            res.status(401).json(`El pedido ${req.params.idPedido} no corresponde al usuario ${usuario.id}`);
        }
    }
}

function quitarCarrito(req, res) {
    for (let usuario of listaUsuarios) {
        if (usuario.id === Number(req.headers.userid)) {
            for (let pedido of listaPedidos) {
                if (pedido.id === Number(req.params.idPedido) && pedido.usuarioId === usuario.id) {
                    for (let producto of pedido.descripcion) {
                        if (producto.id === Number(req.params.idProducto)) {
                            let productoIndex = pedido.descripcion.indexOf(producto);
                            pedido.descripcion.splice(productoIndex, 1);
                            res.status(200).json(`El producto ${producto.nombre} ha sido quitado del pedido`);
                            return;
                        }
                    }
                    res.status(401).json(`El producto ${req.params.idProducto} no corresponde al pedido ${pedido.id}`);
                    return;
                }
            }
            res.status(401).json(`El pedido ${req.params.idPedido} no corresponde al usuario ${usuario.id}`);
        }
    }
}

module.exports = {
    listarProductos,
    crearProducto,
    modificarProducto,
    eliminarProducto,
    agregarCarrito,
    quitarCarrito,
    Producto
}