import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service'
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [
        UserService,
        ArtistService,
        UploadService
    ]
})

export class ArtistEditComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public is_edit;
    public artist_id_to_edit: string;
    public files_to_upload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true;

    }

    ngOnInit() {
        console.log('artist-edit-component cargado correctamente...');

        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            this.artist_id_to_edit = params['id'];
            this._artistService.getArtist(this.token, this.artist_id_to_edit).subscribe(
                response => {
                    console.log(response);
                    if (!response.artist) {
                        //this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                    }
                    this.artist = response.artist;
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
        console.log(this.artist);

        this._artistService.editArtist(this.token, this.artist_id_to_edit, this.artist).subscribe(
            response => {
                if (!response.artist) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                    this.alertMessage = 'El artista se ha editado correctamente';

                    // Subir la imagen del artista
                    this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + this.artist_id_to_edit, [], this.files_to_upload, this.token, 'image')
                        .then(
                            (result) => {
                                this._router.navigate(['./artists/1']);
                            },
                            (error) => {
                                var alertMessage = <any>error;
                                if (alertMessage != null) {
                                    var body = JSON.parse(error._body);
                                    this.alertMessage = body.message;
                                    console.log(error);
                                }
                            }
                        )


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
    }

    fileChangeEvent(fileInput: any) {
        this.files_to_upload = <Array<File>>fileInput.target.files;
        console.log(this.files_to_upload);
    }

}