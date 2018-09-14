import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [
        UserService,
        AlbumService,
        UploadService
    ]
})

export class AlbumEditComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public is_edit;
    public files_to_upload: Array<File>;
    public id_album_to_edit: string;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar album';
        this.album = new Album('', '', 2017, '', '');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.is_edit = true;

    }

    ngOnInit() {
        this.getAlbum();
        console.log(this.album);

        console.log('album-edit-component cargado correctamente...');
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            this.id_album_to_edit = params['id'];
            this._albumService.getAlbum(this.token, this.id_album_to_edit).subscribe(
                response => {
                    if (!response.album) {
                        //this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                        console.log(this.album);
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
        //console.log(this.album);

        this._albumService.editAlbum(this.token, this.id_album_to_edit, this.album).subscribe(
            response => {
                console.log({'Response': response});
                if (!response.albumUpdated) {
                    this.alertMessage = 'Error en el servidor';
                } else {
                    if (this.files_to_upload && this.files_to_upload != null) {
                        // Subir la imagen del album
                        this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + this.id_album_to_edit, [], this.files_to_upload, this.token, 'image')
                            .then(
                                (result) => {
                                    //Ok
                                    //this._router.navigate(['./artist/' + this.album.artist._id]);
                                },
                                (error) => {
                                    var alertMessage = <any>error;
                                    if (alertMessage != null) {
                                        console.log(this.id_album_to_edit);
                                        console.log(error)
                                        var body = JSON.parse(error._body);
                                        this.alertMessage = body.message;
                                        console.log(error);
                                    }
                                }
                            )
                    }
                    this.alertMessage = 'El album se ha editado correctamente';
                    console.log(this.album);
                    //this._router.navigate(['./artist/' + response.albumUpdated.artist]);
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