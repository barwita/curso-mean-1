import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [
        UserService,
        UploadService
    ]
})

export class UserEditComponent implements OnInit {
    public titulo: string;
    public user: User;
    public identity: User;
    public token: string;
    public alertMessage: string;
    public files_to_upload: Array<File>;
    public url: string;

    constructor(
        private _userService: UserService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Actualizar mis datos';

        // Local storage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('user-edit.component.ts cargado...')

    }

    onSubmit() {

        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.alertMessage = 'El usuario no se ha actualizado';
                } else {
                    //this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById('identity_name').innerHTML = this.user.name;

                    if (!this.files_to_upload) {
                        // Redirección...
                    } else {
                        this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.files_to_upload, this.token, 'image')
                            .then(
                                (result: any) => {
                                    this.user.image = result.image;
                                    // Actializo el local storage
                                    localStorage.setItem('identity', JSON.stringify(this.user));

                                    // Actualizo imagen de usuario logueado dinamicamente
                                    let image_path = this.url+'get-image-user/'+this.user.image;
                                    document.getElementById('image-logged').setAttribute('src', image_path);

                                    console.log(this.user);
                                });

                    }
                    this.alertMessage = 'El usuario se ha actualizado correctamente';
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