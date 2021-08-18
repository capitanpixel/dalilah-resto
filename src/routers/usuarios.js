const express = require("express");
const { Usuario } = require("../database/models/usuarios");
const { authLogin, authRegistro, authAdmin, midLogin } = require("../middlewares/usuarios");
const routerUsuarios = express();

// registrar usuario
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
// login usuario
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

routerUsuarios.use("/", midLogin);
// ver usuarios
routerUsuarios.get("/usuarios", authAdmin, async (req, res) => {
    try {
        const u = await Usuario.find();
        res.status(200).json(u);
    } catch(error) {
        console.log(error);
        res.status(404).json(`Error al cargar los usuarios`);
    }
})
// ver historial del usuario
routerUsuarios.get("/usuarios/:idUsuario", async (req, res) => {
    try {
        const usuarioId = Number(req.params.idUsuario);
        const p = Pedidos.find({ usuarioId: usuarioId });
        res.status(200).json(p)
    } catch {
        res.status(404).json(`No se ha podido cargar el historial del usuario`)
    }
})

module.exports = {
    routerUsuarios
}