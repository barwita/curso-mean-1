'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando acción del controlador'
    });
}

function saveUser(req, res) {
    var user = new User(); // Creamos una nueva instancia u objeto de usuario

    var params = req.body; // Recogemos todos los datos que nos vienen en la llamada post
    console.log(params);

    // Asignamos los parametros enviados por post al objeto User
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE USER';
    user.image = 'null';

    if(params.password) {
        // Encriptar contraseña y guardar datos
    }else{
        // Enviar error 500
        res.status(500).send({message: 'Introduce la contraseña'});
    }

}

module.exports = {
    pruebas
};