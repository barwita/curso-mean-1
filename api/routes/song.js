'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Para subir archivos por http
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/prueba-controlador-song', SongController.pruebas);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFileSong);
api.get('/get-file-song/:songFile', SongController.getFileSong);

module.exports = api;
