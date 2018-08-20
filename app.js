'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist')
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras HTTP

// Rutas base
app.use('/api', [user_routes, artist_routes, album_routes, song_routes]);

app.get('/pruebas', function(req, res){
    res.status(200).send({message: 'Esto está chutando!'});
});

module.exports = app;