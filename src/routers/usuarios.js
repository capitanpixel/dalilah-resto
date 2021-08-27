const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { Usuario } = require("../database/models/usuarios");
const { Pedido } = require("../database/models/pedidos")
const { authLogin, authRegistro, authAdmin, midLogin, encript } = require("../middlewares/middlewares");

function makeUsuariosRouter() {

    const router = Router();

    // registrar usuario
    router.post("/register", authRegistro, async (req, res) => {
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
            nuevoUsuario.telefono = req.body.telefono;
            nuevoUsuario.email = req.body.email,
            nuevoUsuario.password = encript(req.body.password);
            nuevoUsuario.agenda.push(req.body.direccion1);
            if (req.body.direccion2) {
                nuevoUsuario.agenda.push(req.body.direccion2);
            }
            if (req.body.direccion3) {
                nuevoUsuario.agenda.push(req.body.direccion3);
            }
            nuevoUsuario.login = false;
            nuevoUsuario.isAdmin = true;
            await nuevoUsuario.save();
            res.status(200).json(`Usuario ${nuevoUsuario.nombreUsuario} registrado con exito`);
        } catch (error) {
            console.log(error);
            res.status(404).json(`Error al registrar usuario`);
        }
    })
    // login usuario
    router.post("/login", authLogin, async (req, res) => {
        try {
            const u = await Usuario.findOne({ nombreUsuario: req.body.nombreUsuario });
            if (u.password === encript(req.body.password)) {
                const token = jwt.sign({ nombreUsuario: u.nombreUsuario }, u.password);
                u.login = true;
                await u.save();
                res.status(200).json({
                    Usuario: u.nombreUsuario,
                    Token: token
                })
            } else {
                res.status(404).json(`Contraseña invalida`);
            }
        } catch (error) {
            console.log(error);
            res.status(404).json(`Error al loguearse`);
        }

    })

    // ver usuarios
    router.get("/usuarios", midLogin, authAdmin, async (req, res) => {
        try {
            const u = await Usuario.find();
            res.status(200).json(u);
        } catch (error) {
            console.log(error);
            res.status(404).json(`Error al cargar los usuarios`);
        }
    })

    // ver historial del usuario
    router.get("/usuarios/:idUsuario", midLogin, async (req, res) => {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const p = await Pedido.find({ usuarioId: usuarioId });
            res.status(200).json(p)
        } catch {
            res.status(404).json(`No se ha podido cargar el historial del usuario`)
        }
    })

    return router;
}

module.exports = {
    makeUsuariosRouter
}