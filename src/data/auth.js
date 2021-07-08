const { listaUsuarios } = require('./database.js');

class Usuario {
    constructor(id, nombreUsuario, nombreApellido, email, telefono, direccion, password, login, isAdmin) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.nombreApellido = nombreApellido;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.password = password;
        this.login = login;
        this.isAdmin = isAdmin;
    }
}

function loginUsuario(req, res) {
    for (let usuario of listaUsuarios) {
        if (usuario.nombreUsuario === req.body.username && usuario.password === req.body.password) {
            usuario.login = true;
            return res.status(200).json(`El usuario ${usuario.nombreUsuario} ha sido ingresado con éxito.`);
            
        }
    }
    res.status(401).json(`Usuario invalido`);
}

function registrarUsuario(req, res) {
    let nuevoUsuario = new Usuario();
    if (listaUsuarios.length === 0) {
        nuevoUsuario.id = 1;
    } else {
        nuevoUsuario.id = listaUsuarios[listaUsuarios.length - 1].id +1 ;
    }
    nuevoUsuario.nombreUsuario = req.body.nombreUsuario;
    nuevoUsuario.nombreApellido = req.body.nombreApellido;
    nuevoUsuario.email = req.body.email;
    nuevoUsuario.telefono = req.body.telefono;
    nuevoUsuario.direccion = req.body.direccion;
    nuevoUsuario.password = req.body.password;
    nuevoUsuario.login = false;
    nuevoUsuario.esAdmin = false;
    listaUsuarios.push(nuevoUsuario);
    res.status(200).json(`El usuario ${nuevoUsuario.nombreUsuario} ha sido registrado con éxito.`);
}

module.exports = {
    loginUsuario,
    registrarUsuario
}