'use strict'

var Album = require('../models/album');
var Song = require('../models/song');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

var mongoosePaginate = require('mongoose-pagination');


function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando acción del controlador de album'
    });
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message:'Error al guardar el album'});
        }else{
            if(!albumStored){
                res.status(404).send({message:'El album no ha sido guardado'});
            }else{
                // Todo ok, devuelvo el artista
                res.status(200).send({album: albumStored});
            }
        }
    });
}

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
            }else{
                res.status(200).send(album);
            }
        }
    });
}

function getAlbums(req, res){
    // Listar todos los albums de un artista, recogemos el id por url
    var artistId = req.params.artist;

    if(!artistId){
        // Sacar todos los albums de la BBDD
        var find = Album.find({}).sort('title');
    }else{
        // Sacar los albums de un artista concreto dado por url
        var find = Album.find({artist: artistId}).sort('year'); //Ordenamos por año 
    }
    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({message: 'No hay albums'});
            }else{
                return res.status(200).send({
                    //total_items: total,
                    albums: albums
                });
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;

    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'El album no ha sido actualizado'});
            }else{
                res.status(200).send({albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err){
           res.status(500).send({message: 'Error en la petición'}); 
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El album no ha sido eliminado'});
            }else{
                // Elimino las canciones asociadas
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Error en la petición'}); 
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'La canción no ha sido eliminada'});
                        }else{
                            // Devuelvo el album eliminado
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                 });
            }
        }
    });
}

function uploadImage (req, res) {
    var albumId = req.params.id;
    var filename = 'Null'

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        //console.log(file_split);

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el album'});
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message: 'No se ha actualizado el album'});
                    }else{
                        res.status(200).send({album: albumUpdated});
                    }
                }
            });
        }else{
            res.status(500).send({message: 'Extensión no valida'})
        }
    }else{
        es.status(500).send({message: 'No se ha subido ninguna imagen'});
    }
}

function getImageFile (req,res) {
    var imageFile = req.params.imageFile; // Nombre del archivo que quiero sacar, llega por url
    var path_file = './uploads/album/'+imageFile;

    fs.exists(path_file, function(exist){
        if(exist){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'No existe la imagen'});
        }
    });
}

module.exports = {
    pruebas,
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}