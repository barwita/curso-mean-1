import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
    selector: 'home',
    templateUrl: '../views/home.html',
})

export class HomeComponent implements OnInit {
    public titulo: string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _user_service: UserService
    ){
        this.titulo = 'Inicio';
    }

    ngOnInit(){
        this.identity = this._user_service.getIdentity();
        console.log('home.component.ts cargado');

        // Conseguir el listado de artistas
    }
}