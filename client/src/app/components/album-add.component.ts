import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [
        UserService,
        AlbumService,
        UploadService
    ]
})

export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Crear nuevo album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','',2017 ,'','');

    }

    ngOnInit() {
        console.log('artist-add-component cargado correctamente...');
    }

    onSubmit() {
        // Cazamos el parametro 'artist._id' que nos viene como parametro por url
        this._route.params.forEach((params: Params) => {
            let artist_id = params['artist'];
            this.album.artist = artist_id;

            console.log(this.album);

        this._albumService.addAlbum(this.token, this.album).subscribe(
            response => {
                if(!response.album) {
                    this.alertMessage = 'Error en el servidor';
                }else{
                    this.album = response.album;
                    this.alertMessage = 'El album se ha creado correctamente';
                    this._router.navigate(['edit-album/'+response.album._id]);
                }
            },
            error => {
                var alertMessage = <any>error;

                if (alertMessage != null) {
                    var body = JSON.parse(error._body);
                    this.alertMessage = body.message;
                    console.log(error);
                }
            }
        );
        });
    }
}