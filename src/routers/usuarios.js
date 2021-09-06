const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { Usuario } = require("../database/models/usuarios");
const { Pedido } = require("../database/models/pedidos")
const { midIdUsuario } = require("../middlewares/middlewares");
const { authLogin, authRegistro, authAdmin, midLogin, encript, midSuspendido, authUser } = require("../middlewares/auth");
const dotenv = require('dotenv');

function makeUsuariosRouter() {

    const router = Router();
    dotenv.config();
    const { USER_TEST } = process.env;

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
            nuevoUsuario.email = req.body.email;
            nuevoUsuario.password = encript(req.body.password);
            nuevoUsuario.agenda.push(req.body.direccion1);
            if (req.body.direccion2) {
                nuevoUsuario.agenda.push(req.body.direccion2);
            }
            if (req.body.direccion3) {
                nuevoUsuario.agenda.push(req.body.direccion3);
            }
            nuevoUsuario.login = false;
            nuevoUsuario.suspendido = false;
            await nuevoUsuario.save();
            res.status(200).json(`Usuario ${nuevoUsuario.nombreUsuario} registrado con exito`);
        } catch(e) {
            console.log(e);
            res.status(400).json(`Error al registrar usuario`);
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
                res.status(400).json(`Contraseña invalida`);
            }
        } catch {
            res.status(400).json(`Error al loguearse`);
        }

    })
    
    // logout
    router.post("/logout", authUser, midLogin, async (req, res) => {
        try {
            const idUsuario = Number(req.headers.userid);
            const u = await Usuario.findOne({ id: idUsuario });
            u.login = false;
            u.save();
            res.status(200).json(`Usuario ${u.nombreUsuario} ha cerrado sesión`);
        } catch {
            res.status(404).json(`Error al cerrar sesión`);
        }
    })

    // suspender usuario
    router.post("/usuarios/:idUsuario", authAdmin, midLogin, async (req, res) => {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const u = await Usuario.findOne({ id: usuarioId });
            u.suspendido = req.body.suspendido;
            u.login = false;
            u.save();
            res.status(200).json(`El estado de suspensión de ${u.nombreUsuario} ha sido modificado a ${u.suspendido}`);
        } catch {
            res.status(400).json(`Error al suspender usuario`);
        }
    })

    // eliminar usuario de prueba
    router.delete("/usuarios/test", async (req, res) => {
        try {
            await Usuario.deleteOne({ nombreUsuario: `${USER_TEST}` });
            res.status(200).json(`Usuario eliminado`);
        } catch {
            res.status(400).json(`Error al eliminar usuario`);
        }
    })

    // ver usuarios
    router.get("/usuarios", midLogin, async (req, res) => {
        try {
            const u = await Usuario.find();
            res.status(200).json(u);
        } catch {
            res.status(400).json(`Error al cargar los usuarios`);
        }
    })

    // ver historial del usuario
    router.get("/usuarios/:idUsuario", authUser, midLogin, midIdUsuario, async (req, res) => {
        try {
            const usuarioId = Number(req.params.idUsuario);
            const p = await Pedido.find({ usuarioId: usuarioId });
            res.status(200).json(p)
        } catch {
            res.status(400).json(`No se ha podido cargar el historial del usuario`)
        }
    })

    return router;
}

module.exports = {
    makeUsuariosRouter
}