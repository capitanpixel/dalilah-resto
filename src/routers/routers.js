const express = require('express');
const router = express();

const { authAdmin, authRegistro, authLogin, midLogin, midId } =  require('../middlewares/auth.js');
const { midModificarPedido, midIdPedido } = require('../middlewares/pedidos.js');
const { midCrearProducto, midIdProducto, } = require('../middlewares/productos.js');
const { midMetodoPago, midCrearMedioPago, midIdPago } = require('../middlewares/mediosdepago.js');
const { registrarUsuario, loginUsuario } = require('../data/auth.js');
const { crearPedido, pagarPedido, modificarPedido, eliminarPedido, listarPedidos, verHistorial } = require('../data/pedidos.js');
const { agregarCarrito, quitarCarrito, crearProducto, listarProductos, modificarProducto, eliminarProducto } = require('../data/productos.js');
const { crearMedioPago, eliminarMedioPago, modificarMedioPago, verMedioPago } = require('../data/mediospago.js');
const { verUsuarios, eliminarUsuario, modificarUsuario } = require('../data/usuarios.js');

router.use(express.json());

//auth
router.post("/login", authLogin, loginUsuario);
router.post("/register", authRegistro, registrarUsuario); 

router.use("/", midLogin);

//usuarios
router.get("/usuarios", authAdmin, verUsuarios);
//pedidos
router.get("/pedidos", authAdmin, listarPedidos);
router.post("/pedidos", crearPedido); 
router.get("/pedidos/historial", verHistorial);
router.post("/pedidos/:idPedido", midMetodoPago, pagarPedido); 
router.put("/pedidos/:idPedido", authAdmin, midIdPedido, midModificarPedido, modificarPedido); 
router.delete("/pedidos/:idPedido", authAdmin, midIdPedido, eliminarPedido); 
//productos
router.get("/productos", listarProductos); 
router.post("/productos", authAdmin, midCrearProducto, crearProducto); 
router.put("/productos/:idProducto", authAdmin, midCrearProducto, modificarProducto); 
router.delete("/productos/:idProducto", authAdmin, midIdProducto, eliminarProducto);
router.post("/productos/:idPedido/:idProducto",midIdPedido, midIdProducto, agregarCarrito);
router.delete("/productos/:idPedido/:idProducto", midIdPedido, midIdProducto, quitarCarrito);
//medios de pago
router.get("/mediosdepago", authAdmin, verMedioPago);
router.post("/mediosdepago", authAdmin, midCrearMedioPago, crearMedioPago); 
router.delete("/mediosdepago/:idMedioPago", authAdmin, midIdPago, eliminarMedioPago); 
router.put("/mediosdepago/:idMedioPago", authAdmin, midIdPago, midCrearMedioPago, modificarMedioPago); 

module.exports = {
    router
}