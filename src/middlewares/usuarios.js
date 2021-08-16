const { Usuario } = require("../database/models/usuarios");

function authAdmin(req, res, next) {
    const u = Usuario.findOne({ id: req.headers.usuarioId });
    if (u.esAdmin === true) {
        return next();
    } else {
        res.status(401).json("No es administrador");
    }
}

function authRegistro(req, res, next) {

    const u = Usuario.find();
    for (let usuario of u) {
        if (usuario.email === req.body.email) {
            res.status(406).json("Email ya existente");
        }
    }
    if (req.body.nombreUsuario === null || req.body.nombreUsuario === undefined) {
        res.status(406).json("Nombre de usuario inválido");
    } else if (req.body.nombreApellido === null || req.body.nombreApellido === undefined) {
        res.status(406).json("Nombre y apellido inválidos");
    } else if (req.body.email === null || req.body.email === undefined) {
        res.status(406).json("Email inválido");
    } else if (req.body.telefono === null || req.body.telefono === undefined) {
        res.status(406).json("Teléfono inválido");
    } else if (req.body.direccion === null || req.body.direccion === undefined) {
        res.status(406).json("Direción inválida");
    } else if (req.body.password === null || req.body.password === undefined) {
        res.status(406).json("Contraseña inválida");
    } else {
        return next();
    }
}

function authLogin(req, res, next) {
    if (req.body.nombreUsuario === null || req.body.nombreUsuario === undefined) {
        res.status(406).json("Nombre de usuario inválido");
    } else if (req.body.password === null || req.body.password === undefined) {
        res.status(406).json("Contraseña inválida");
    } else {
        return next();
    }
}

function midLogin(req, res, next) {
    const u = Usuario.findOne({ id: req.headers.usuarioId });
    if (u.login) {
        return next();
    } else {
        res.status(406).json("Usted debe loguearse");
    }
}

module.exports = {
    authAdmin,
    authRegistro,
    authLogin,
    midLogin,
}
