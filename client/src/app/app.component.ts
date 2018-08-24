import { Component } from '@angular/core';
import { User } from './models/user'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public title = 'MUSIFY';
  public user: User;
  public identity;
  public token; // identity y token irán en el local storage

  constructor(){
    // Asignamos un valor a una propiedad de una clase
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }
}
