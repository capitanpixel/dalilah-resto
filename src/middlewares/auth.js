const { listaUsuarios, listaProductos, listaPedidos, mediosPago } = require("../data/database");

function authAdmin(req, res, next) {
    for (let usuario of listaUsuarios) {
        if (usuario.id === Number(req.headers.userid)) {
            if (usuario.esAdmin === true) {
                return next();
            }
        } 
    }    
    res.status(401).json("No es administrador");
}


function authRegistro(req, res, next) {
    for (let usuario of listaUsuarios) {
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
    } else if (req.body.direccion === null || req.body.direccion  === undefined) {
        res.status(406).json("Direción inválida");
    } else if (req.body.password === null || req.body.password  === undefined) {
        res.status(406).json("Contraseña inválida");
    } else {
        return next();
    }
}

function authLogin(req, res, next) {
    if (req.body.username === null || req.body.username === undefined) {  
        res.status(406).json("Nombre de usuario inválido");
    } else if (req.body.password === null || req.body.password === undefined) {
        res.status(406).json("Contraseña inválida");
    } else {
        return next();
    }
}

function midLogin(req, res, next) {
    for (let usuario of listaUsuarios) {
        if (usuario.id === Number(req.headers.userid)) {
            if (usuario.login) {
                return next();
            } else {
                res.status(406).json("Usted debe loguearse");
            }
        }
    }
    res.status(401).json("Id de Usuario inválido");
}

module.exports = {
    authAdmin,
    authRegistro,
    authLogin,
    midLogin,
}
