const jwt = require('jsonwebtoken');
const { createHmac } = require('crypto');
const { Usuario } = require("../database/models/usuarios");

function encript(secret) {
    return createHmac('sha256', secret).digest('hex');
}

async function authAdmin(req, res, next) {
    try {
        const { JWT_SECRET } = process.env;
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        jwt.verify(token, encript(JWT_SECRET), (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(401).send('Usted no es administrador');
            } else {
                req.user = decoded;
                next();
            }
        });
    } catch {
        res.status(404).json(`Se produjo un error`);
    }
}

async function authUser(req, res, next) {
    try {
        const idUsuario = Number(req.headers.userid);
        const u = await Usuario.findOne({ id: idUsuario });
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        jwt.verify(token, u.password, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(401).send('Token incorrecto');
            } else {
                req.user = decoded;
                next();
            }
        })
    } catch {
        res.status(404).json(`Error al comprobar token`);
    }
}

async function authRegistro(req, res, next) {
    try {
        const u = await Usuario.findOne({ email: req.body.email });
        const n = await Usuario.findOne({ email: req.body.nombreUsuario });
        if (u) {
            return res.status(400).json("Email ya existente");
        }
        if (n) {
            return res.status(400).json("Usuario ya existente");
        }
        if (req.body.nombreUsuario === null || req.body.nombreUsuario === undefined) {
            return res.status(400).json("Nombre de usuario inválido");
        } else if (req.body.nombreApellido === null || req.body.nombreApellido === undefined) {
            return res.status(400).json("Nombre y apellido inválidos");
        } else if (req.body.email === null || req.body.email === undefined) {
            return res.status(400).json("Email inválido");
        } else if (req.body.telefono === null || req.body.telefono === undefined) {
            return res.status(400).json("Teléfono inválido");
        } else if (req.body.direccion1 === null || req.body.direccion1 === undefined) {
            return res.status(400).json("Direción inválida");
        } else if (req.body.password === null || req.body.password === undefined) {
            return res.status(400).json("Contraseña inválida");
        } else {
            return next();
        }

    } catch {
        res.status(405).json(`Se produjo un error`);
    }
}

function authLogin(req, res, next) {
    if (req.body.nombreUsuario === null || req.body.nombreUsuario === undefined) {
        res.status(400).json("Nombre de usuario inválido");
    } else if (req.body.password === null || req.body.password === undefined) {
        res.status(400).json("Contraseña inválida");
    } else {
        return next();
    }
}

async function midLogin(req, res, next) {
    try {
        const idUsuario = Number(req.headers.userid);
        const u = await Usuario.findOne({ id: idUsuario });
        if (u.login === true) {
            return next();
        } else {
            res.status(401).json("Usted debe loguearse");
        }

    } catch {
        res.status(405).json(`Se produjo un error`);
    }
}

async function midSuspendido(req, res, next) {
    try {
        const u = await Usuario.findOne({ nombreUsuario: req.body.nombreUsuario });
        if (u.suspendido === true) {
            res.status(401).json(`Usted está suspendido`);
        } else {
            return next();
        }
    } catch {
        res.status(405).json(`Error al validar suspensión del usuario`)
    }
} 

module.exports = {
    authAdmin,
    authUser,
    authRegistro,
    authLogin,
    midLogin,
    midSuspendido,
    encript
}