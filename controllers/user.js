'use strict'

var bcrypt = require('bcrypt-nodejs'); // Cargamos el módulo de bcrypt para encriptar contraseñas
var User = require('../models/user'); // Cargamos el módulo del módelo de la BBDD
var jwt = require('../services/jwt')

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
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password) {
        // Encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(error, hash) {
            user.password = hash;
            if (user.name!= null && user.surname != null && user.email != null) {
                // Guardamos el usuario
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored) {
                            res.status(404).send({message: 'No se ha registrado el usuario debido a un error inesperado'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });

            }else{
                // Si faltan elementos envio error
                res.status(200).send ({message: 'Rellena todos los campos'});
            }
        });
    }else{
        // Enviar error 500
        res.status(200).send({message: 'Introduce la contraseña'});
    }

}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!user) {
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                // Comprobar la contraseña, comparar con bcrypt
                bcrypt.compare(password, user.password, function(err, check){
                    if (check) {
                        // Devolver los datos del usuario logueado
                        if (params.gethash){
                            // Devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }

                    }else{
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
};