import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [
        UserService,
        UploadService,
        SongService
    ]
})

export class SongEditComponent implements OnInit {
    public titulo;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public is_edit: boolean;
    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _songService: SongService
    ) {
        this.titulo = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit = true;

    }

    ngOnInit() {
        console.log('song-edit-component cargado correctamente...');

        //Recuperar canción de la BBDD
        this.getSong();
    }

    public id_song_to_edit;

    getSong() {
        this._route.params.forEach((params: Params) => {
            this.id_song_to_edit = params['id'];
            this._songService.getSong(this.token, this.id_song_to_edit).subscribe(
                response => {
                    if (!response) {
                        //this._router.navigate(['/']);
                    } else {
                        this.song = response.song;
                        //console.log(response.song);
                    }
                },
                error => {
                    var alertMessage = <any>error;
                    if (alertMessage != null) {
                        var body = JSON.parse(error._body);
                        //this.alertMessage = body.message;
                        console.log(error);
                    }
                }
            )
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let song_id = params['id'];

            console.log(this.song);

        this._songService.editSong(this.token, song_id, this.song).subscribe(
            response => {
                if(!response.songUpdated) {
                    this.alertMessage = 'Error en el servidor';
                }else{
                    //this.song = response.song;
                    this.alertMessage = 'La canción se ha editado correctamente';
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