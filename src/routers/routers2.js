const express = require("express");
const { routerPagos } = require("./mediosdepago");
const { routerPedidos } = require("./pedidos");
const { routerProductos } = require("./productos");
const { routerUsuarios } = require("./usuarios");
const router = express();

router.use(express.json());
router.use(routerPagos);
router.use(routerPedidos);
router.use(routerUsuarios);
router.use(routerProductos);

module.exports = {
    router
}