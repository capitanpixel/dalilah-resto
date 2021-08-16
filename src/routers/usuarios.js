const express = require("express");
const routerUsuarios = express();
const { Usuario } = require("../database/models/usuarios");
const { authLogin, authRegistro } = require("../middlewares/usuarios");

routerUsuarios.get("/usuarios", async (req, res) => {
    try {
        const u = await Usuario.find();
        res.status(200).json(u);
    } catch(error) {
        console.log(error);
        res.status(404).json(`Error al cargar los usuarios`);
    }
})

routerUsuarios.get("/usuarios/:idUsuario", async (req, res) => {
    try {
        const p = Pedidos.find({ usuarioId: req.params.idUsuario});
        res.status(200).json(p)
    } catch {
        res.status(404).json(`No se ha podido cargar el historial del usuario`)
    }
})

routerUsuarios.post("/register", authRegistro, async (req, res) => {
    try {
        const u = await Usuario.find();
        const nuevoUsuario = await new Usuario();
        if (u.length === 0) {
            nuevoUsuario.id = 1;
        } else {
            nuevoUsuario.id = u[u.length - 1].id + 1;
        }
        nuevoUsuario.nombreUsuario = req.body.nombreUsuario;
        nuevoUsuario.nombreApellido = req.body.nombreApellido;
        nuevoUsuario.direccion = req.body.direccion;
        nuevoUsuario.telefono = req.body.telefono;
        nuevoUsuario.email = req.body.email,
        nuevoUsuario.password = req.body.password;
        nuevoUsuario.login = false;
        nuevoUsuario.isAdmin = false;
        await nuevoUsuario.save();
        res.status(200).json(`Usuario ${nuevoUsuario.nombreUsuario} registrado con exito`);
    } catch(error) {
        console.log(error);
        res.status(404).json(`Error al registrar usuario`);
    }
})

routerUsuarios.post("/login", authLogin, async (req, res) => {
    try {
        const u = await Usuario.findOne({ nombreUsuario: req.body.nombreUsuario });
        if (u.password === req.body.password) {
            u.login = true;
            await u.save();
            res.status(200).json(`Logueado con exito`);
        } else {
            res.status(404).json(`Contraseña invalida`);
        }
    } catch(error) {
        console.log(error);
        res.status(404).json(`Error al loguearse`);
    }

})

routerUsuarios.delete("/usuarios/:idUsuario", async (req, res) => {
    try {
        const u = await Usuario.deleteOne({ id: req.params.idUsuario });
        res.status(200).json(`Usuario eliminado`);
    } catch {
        res.status(404).json(`Error al eliminar usuario`);
    }
})

module.exports = {
    routerUsuarios
}