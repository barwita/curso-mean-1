import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user'
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user: User;
  public userRegister: User;
  public identity;
  public token; // identity y token irán en el local storage
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService
  ){
    this.url = GLOBAL.url;

    // Asignamos un valor a una propiedad de una clase
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit(){
    // Asignamos los valores del local storage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.identity = this._userService.identity;
    this.token = this._userService.token;

    console.log(this.identity);
    console.log(this.token);
    
  }

  public onSubmit(){
      // Conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        this.errorMessage = null;
        //Aqui tendremos todos los datos que nos devuelva la API en caso de que todo ok
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("El usuario no está correctamente identificado");
        }else{
          // Crear elemento en el local storage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));

          // Conseguir el token para enviarlo en cada petición
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              //Aqui tendremos todos los datos que nos devuelva la API en caso de que todo ok
              let token = response.token;
              this.token = token;
      
              if(this.token.lenght <= 0){
                alert("El token no se ha generado correctamente");
              }else{
                // Crear elemento en el local storage para tener al token en sesión
                localStorage.setItem('token', token);
                
                console.log(this.token);
                console.log(this.identity);
                
                // Vacio el usuario
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
              error => {
                var errorMessage = <any>error;
                
                if (errorMessage != null) {
                  var body = JSON.parse(error._body);
                  this.errorMessage = body.message;
                  console.log(error);
                }
              }
            )
        }
      },
      error => {
        var errorMessage = <any>error;
        
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    localStorage.clear();

    this.identity = null;
    this.token = null;
  }

  onSubmitRegister(){
    console.log(this.userRegister);

    this._userService.register(this.userRegister).subscribe(
      response => {
        let user = response.user;
        this.userRegister = user;

        if (!user._id) {
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente. Identificate con '+this.userRegister.email;
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }
  

}
