import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [
        UserService,
        AlbumService,
        UploadService,
        SongService
    ]
})

export class SongAddComponent implements OnInit {
    public titulo;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService,
        private _songService: SongService
    ) {
        this.titulo = 'Crear nueva canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');

    }

    ngOnInit() {
        console.log('song-add-component cargado correctamente...');
        console.log(this.titulo);
    }

    onSubmit() {
        // Cazamos el parametro 'album._id' que nos viene como parametro por url
        this._route.params.forEach((params: Params) => {
            let album_id = params['album'];
            this.song.album = album_id;

            console.log(this.song);

        this._songService.addSong(this.token, this.song).subscribe(
            response => {
                if(!response.song) {
                    this.alertMessage = 'Error en el servidor';
                }else{
                    this.song = response.song;
                    this.alertMessage = 'La canción se ha creado correctamente';
                    //this._router.navigate(['edit-album/'+response.album._id]);
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