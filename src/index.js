const express = require("express");
const dotenv = require("dotenv");
const { loadSwaggerInfo } = require("./middlewares/documentation.js");
const { initDatabase } = require("./database");
const { routerProductos } = require("./routers/productos.js");
const { routerPedidos } = require("./routers/pedidos.js");
const { routerPagos } = require("./routers/mediosdepago.js");
const { routerUsuarios } = require("./routers/usuarios.js");

async function main() {

    const server = express();
    dotenv.config();
    server.use(express.json());
    loadSwaggerInfo(server);
    const PORT = process.env.PORT;

    try {
        await initDatabase();
        server.use("/api/v1", routerProductos);
        server.use("/api/v1", routerPedidos);
        server.use("/api/v1", routerPagos);
        server.use("/api/v1", routerUsuarios);
        server.listen(PORT, () => {
            console.log('Servidor funcionando en puerto 3000!');
        })
    } catch (error) {
        console.log(error);
        console.log("No pudo cargar la base de datos");
    }

}

main();

