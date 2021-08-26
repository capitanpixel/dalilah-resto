const redis = require("redis");
const express = require("express");
const serverCache = express();
const { Usuario } = require("../src/database/models/usuarios");

const client = redis.createClient();
client.on("error", function (error) {
    console.error(error);
})

serverCache.get("/cache/usuarios", async (req, res) => {
    client.get("usuarios", (error, rep) => {
        if(error) {
            res.json(error);
        }
        if(rep) {
            res.json(rep);
        }
    })
    const u = await Usuario.find();
    client.set("usuarios", JSON.stringify(u));
    return res.json(u);
})

module.exports = {
    serverCache
}

