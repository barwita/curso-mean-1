import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service'
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [
        UserService,
        ArtistService
    ]
})

export class ArtistDetailComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public artist_id: string

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Detalles artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

    }

    ngOnInit() {
        console.log('artist-detail-component cargado correctamente...');

        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            this.artist_id = params['id'];
            this._artistService.getArtist(this.token, this.artist_id).subscribe(
                response => {
                    console.log(response);
                    if (!response.artist) {
                        //this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;

                        // Sacar los albums del artista
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