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
                res.status(401).send('You are not authorized.   .|.');
            } else {
                req.user = decoded;
                next();
            }
        });
        /*
        const idUsuario = Number(req.headers.userid);
        const u = await Usuario.findOne({ id: idUsuario });
        if (u.isAdmin === true) {
            return next();
        } else {
            res.status(401).json("No es administrador");
            
        }
        */
    } catch (error) {
        console.log(error);
        res.status(404).json(`Se produjo un error`);
    }
}

async function authRegistro(req, res, next) {
    try {
        const u = await Usuario.findOne({ email: req.body.email });
        if (u) {
            return res.status(406).json("Email ya existente");
        }
        if (req.body.nombreUsuario === null || req.body.nombreUsuario === undefined) {
            return res.status(406).json("Nombre de usuario inválido");
        } else if (req.body.nombreApellido === null || req.body.nombreApellido === undefined) {
            return res.status(406).json("Nombre y apellido inválidos");
        } else if (req.body.email === null || req.body.email === undefined) {
            return res.status(406).json("Email inválido");
        } else if (req.body.telefono === null || req.body.telefono === undefined) {
            return res.status(406).json("Teléfono inválido");
        } else if (req.body.direccion === null || req.body.direccion === undefined) {
            return res.status(406).json("Direción inválida");
        } else if (req.body.password === null || req.body.password === undefined) {
            return res.status(406).json("Contraseña inválida");
        } else {
            return next();
        }

    } catch (error) {
        console.log(error);
        res.status(404).json(`Se produjo un error`);
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

async function midLogin(req, res, next) {
    try {
        const idUsuario = Number(req.headers.userid);
        const u = await Usuario.findOne({ id: idUsuario });
        if (u.login === true) {
            return next();
        } else {
            res.status(406).json("Usted debe loguearse");
        }

    } catch (error) {
        console.log(error);
        res.status(404).json(`Se produjo un error`);
    }
}

module.exports = {
    authAdmin,
    authRegistro,
    authLogin,
    midLogin,
    encript
}
