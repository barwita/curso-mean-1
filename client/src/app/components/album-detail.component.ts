import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service'
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/album-detail.html',
    providers: [
        UserService,
        ArtistService,
        AlbumService
    ]
})

export class AlbumDetailComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public album_id: string;
    public alertMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Canciones del album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

    }

    ngOnInit() {
        console.log('album-detail-component cargado correctamente...');

        // Sacar album de la base de datos
        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            this.album_id = params['id'];
            this._albumService.getAlbum(this.token, this.album_id).subscribe(
                response => {
                    if (!response.album) {
                        //this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                        console.log(this.album);

                        /*
                        // Sacar los songs del album
                        this._albumService.getAlbums(this.token, this.album_id).subscribe(
                            response => {
                                if (!response.albums) {
                                    this.alertMessage = 'Este artista no tiene albums'
                                } else {
                                    console.log(response.albums);
                                    this.albums = response.albums;
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
                        */
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
}