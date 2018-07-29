'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras HTTP

// Rutas base
app.use('/api', user_routes);

app.get('/pruebas', function(req, res){
    res.status(200).send({message: 'Esto está chutando!'});
});

module.exports = app;