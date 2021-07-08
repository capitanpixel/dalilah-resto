const express = require("express");
const { router } = require("./routers/routers.js");
const { loadSwaggerInfo } = require("./middlewares/documentation.js");

function main() {
    const server = express();
    loadSwaggerInfo(server);
    server.use('/api/v1', router);
    server.listen(3000, () => console.log("escuchando servidor 3000"));
}

main();

