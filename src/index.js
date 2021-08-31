const express = require("express");
const dotenv = require("dotenv");
const helmet = require('helmet')
const { loadSwaggerInfo } = require("./middlewares/documentation.js");
const { initDatabase } = require("./database");
const { makeProductosRouter } = require("./routers/productos.js");
const { makePedidosRouter } = require("./routers/pedidos.js");
const { makePagosRouter } = require("./routers/mediosdepago.js");
const { makeUsuariosRouter } = require("./routers/usuarios.js");

async function main() {

    const server = express();
    dotenv.config();
    loadSwaggerInfo(server);
    const { PORT } = process.env;
    
    try {
        await initDatabase();
        server.use(helmet());
        server.use(express.json());
        server.use("/api/v1", makeProductosRouter());
        server.use("/api/v1", makePedidosRouter());
        server.use("/api/v1", makePagosRouter());
        server.use("/api/v1", makeUsuariosRouter());
        server.listen(PORT, () => {
            console.log('Servidor funcionando en puerto 3000!');
        })
    } catch(error) {
        console.log("No pudo cargar la base de datos", error);
    }

}

main();

