let listaUsuarios = [
    {
        "id": 1,
        "nombreUsuario": "admin",
        "nombreApellido": "Diego Seoane",
        "email": "diegoseoane@gmail.com",
        "telefono": 2901444444,
        "direccion": "lasraices57",
        "password": "diego",
        "login": false,
        "esAdmin": true,
        "favoritos": [],
    }
];

let listaProductos = [
    {
        "id": 1,
        "precio": 300,
        "nombre": "hamburguesa",
        "descripcion": "muy rica",
        "img": "www.burguer.com"
    },
    {
        "id": 2,
        "precio": 500,
        "nombre": "pizza",
        "descripcion": "abundante",
        "img": "www.pizza.com"
    },
    {
        "id": 3,
        "precio": 150,
        "nombre": "papas",
        "descripcion": "picantes",
        "img": "www.papas.com"
    },
];

let mediosPago = [
    {
        "id": 1,
        "nombre": "efectivo"
    },
    {
        "id": 2,
        "nombre": "debito"
    },
    {
        "id": 3,
        "nombre": "credito"
    }
];

let estadoPedidos = [
    {
        "id": 1,
        "nombre": "pendiente"
    },
    {
        "id": 2,
        "nombre": "confirmado"
    },
    {
        "id": 3,
        "nombre": "en preparacion"
    },
    {
        "id": 4,
        "nombre": "enviado"
    },
    {
        "id": 5,
        "nombre": "entregado"
    },
];

let listaPedidos = [];
let listaHistorialPedidos = [];

module.exports = {
    listaUsuarios,
    listaPedidos,
    listaHistorialPedidos,
    listaProductos,
    mediosPago,
    estadoPedidos
}

