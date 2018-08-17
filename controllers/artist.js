'use strict'

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

var mongoosePaginate = require('mongoose-pagination');


function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando acción del controlador de artistas'
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message:'Error al guardar el artusta'});
        }else{
            if(!artistStored){
                res.status(404).send({message:'El artista no ha sido guardado'});
            }else{
                // Todo ok, devuelvo el artista
                res.status(200).send({artist: artistStored});
            }
        }
    });
}

function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe'});
            }else{
                res.status(200).send(artist);
            }
        }
    });
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No hay artistas'});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req, res){
    var artistId = req.params.id;

    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            }else{
                res.status(200).send({artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
           res.status(500).send({message: 'Error en la petición'}); 
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{

                // Elimino el album y sus canciones asociadas
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Error en la petición'}); 
                     }else{
                         if(!artistRemoved){
                             res.status(404).send({message: 'El album no ha sido eliminado'});
                         }else{
                             Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                if(err){
                                    res.status(500).send({message: 'Error en la petición'}); 
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({message: 'La canción no ha sido eliminada'});
                                    }else{
                                        // Devuelvo el artista eliminado
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                             });
                         }
                     }
                });
            }
        }
    });
}

function uploadImage (req, res) {
    var userId = req.params.id;
    var filename = 'Null'

    if(req.files) {
        var filepath = req.files.image.path;
        console.log(filepath);
        res.status(200).send({message: 'Image uploaded succesfully'})
    }else{
        es.status(500).send({message: 'No se ha subido ninguna imagen'});
    }
}

function getImageFile (req,res) {
    var imageFile = req.params.imageFile; // Nombre del archivo que quiero sacar, llega por url
    var path_file = './uploads/artist/'+imageFile;

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
    saveArtist,
    getArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};