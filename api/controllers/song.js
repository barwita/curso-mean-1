'use strict'

var Song = require('../models/song');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

var mongoosePaginate = require('mongoose-pagination');


function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando acción del controlador de canciones'
    });
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message:'Error al guardar la canción'});
        }else{
            if(!songStored){
                res.status(404).send({message:'La canción no ha sido guardada'});
            }else{
                // Todo ok, devuelvo el artista
                res.status(200).send({song: songStored});
            }
        }
    });
}

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!song){
                res.status(404).send({message: 'La canción no existe'});
            }else{
                res.status(200).send({song: song});
            }
        }
    });
}

function getSongs(req, res){
    // Listar todos los songs de un album, recogemos el id por url
    var albumId = req.params.album;

    if(!albumId){
        // Sacar todos los albums de la BBDD
        var find = Song.find({}).sort('title');
    }else{
        // Sacar los albums de un artista concreto dado por url
        var find = Song.find({album: albumId}).sort('number'); //Ordenamos por number 
    }
    find.populate({path: 'album'}).exec((err, songs) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'});
            }else{
                return res.status(200).send({
                    //total_items: total,
                    songs: songs
                });
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;

    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'La canción no ha sido actualizada'});
            }else{
                res.status(200).send({songUpdated});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err){
           res.status(500).send({message: 'Error en la petición'}); 
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'La canción no ha sido eliminada'});
            }else{
                // Devuelvo la cancion eliminada
                res.status(200).send({song: songRemoved});
            }
        }
    });
}

function uploadFileSong (req, res) {
    var songId = req.params.id;
    var filename = 'Null'

    if(req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //console.log(file_split);

        if(file_ext == 'mp3'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar la canción'});
                }else{
                    if(!songUpdated){
                        res.status(404).send({message: 'No se ha actualizado la cancuón'});
                    }else{
                        res.status(200).send({album: songUpdated});
                    }
                }
            });
        }else{
            res.status(500).send({message: 'Extensión no valida'})
        }
    }else{
        es.status(500).send({message: 'No se ha subido ningún archuvo'});
    }
}

function getFileSong (req,res) {
    var songFile = req.params.songFile; // Nombre del archivo que quiero sacar, llega por url
    var path_file = './uploads/songs/'+songFile;

    fs.exists(path_file, function(exist){
        if(exist){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'No existe el archivo de canción'});
        }
    });
}

module.exports = {
    pruebas,
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFileSong,
    getFileSong
}