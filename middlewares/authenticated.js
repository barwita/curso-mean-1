'use string'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req,res,next) {
    // Comprobamos si nos viene el header de autenticación
    if(!req.headers.authorization){
        // Si no nos viene devuelvo mensaje de error 403
        return res.status(403).send({message: 'La petición no tiene cabecera de autenticación'});
    }

    // En caso de que si que nos venga la cabecera
    var token = req.headers.authorization.replace(/['"]+/g, ''); // Recojo la cabecera y reemplazo las comillas si viene

    try {
        // Decodificamos el token y lo guardamos en la variable payload
        // para ello usamos la clave secreta "secret"
        var payload = jwt.decode(token, secret); 

        // Comprobamos si ha expirado el token
        if(payload.exp <= moment.unix()){
            return res.status(401).send({message: 'El token ha expirado, es necesario loguearse de nuevo'});
        }
    } catch (ex) {
        console.log(ex);
        return res.status(400).send({message: 'Token no valido'});
    }
    // Si todo ok...
    req.user = payload; // Asigno a la respuesta el objeto payload

    next(); // Salgo del middleware
};