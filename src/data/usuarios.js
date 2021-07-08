const { listaUsuarios } = require("./database");

function verUsuarios(req, res) {
    res.status(200).json(listaUsuarios);
}

function eliminarUsuario(req, res) {
    for (let usuario of listaUsuarios) {
        if (usuario.id === req.headers.userid) {
            let usuarioIndex = listaUsuarios.indexOf(usuario);
            listaUsuarios.splice(usuarioIndex, 1);
            res.status(200).json(`El usuario ${usuario.id} ha sido eliminado.`);
        }
    }
}

module.exports = {
    verUsuarios,
    eliminarUsuario,
}