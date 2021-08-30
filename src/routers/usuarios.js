const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { Usuario } = require("../database/models/usuarios");
const { Pedido } = require("../database/models/pedidos")
const { authLogin, authRegistro, authAdmin, midLogin, encript, midIdUsuario, midSuspendido } = require("../middlewares/middlewares");

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
            nuevoUsuario.suspendido = false;
            await nuevoUsuario.save();
            res.status(200).json(`Usuario ${nuevoUsuario.nombreUsuario} registrado con exito`);
        } catch (error) {
            console.log(error);
            res.status(404).json(`Error al registrar usuario`);
        }
    })
    // login usuario
    router.post("/login", authLogin, midSuspendido, async (req, res) => {
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

    router.post("/logout", midLogin, async (req, res) => {
        try {
            const idUsuario = Number(req.headers.userid);
            const u = await findOne({ id: idUsuario });
            u.login = false;
            u.save();
            res.status(200).json(`Usuario ${u.nombreUsuario} ha cerrado sesión`);
        } catch {
            res.status(404).json(`Error al cerrar sesión`);
        }
    })

    router.post("/suspension/:idUsuario", async (req, res) => {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const u = await Usuario.findOne({ id: usuarioId });
            u.suspendido = req.body.suspendido;
            u.login = false;
            u.save();
            res.status(200).json(`El estado de suspensión de ${u.nombreUsuario} ha sido modificado a ${u.suspendido}`);
        } catch {
            res.status(404).json(`Error al suspender usuario`);
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
    router.get("/usuarios/:idUsuario", midLogin, midIdUsuario, async (req, res) => {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const p = await Pedido.find({ usuarioId: usuarioId });
            res.status(200).json(p)
        } catch {
            res.status(404).json(`No se ha podido cargar el historial del usuario`)
        }
    })

    router.post("/usuarios/:idUsuario", authAdmin, async (req, res) => {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const u = await findOne({ id: usuarioId});
            u.suspendido = true;
            u.save();
            res.status(200).json(`El usuario ${u.nombreUsuario} ha sido suspendido`);
        } catch {
            res.status(404).json(`No se ha podido suspender al usuario`);
        }
    })

    return router;
}

module.exports = {
    makeUsuariosRouter
}