import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Importar home
import { HomeComponent } from './components/home.component';

// Importar componentes de usuario
import { UserEditComponent } from './components/user-edit.component';

// Importar artistas
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

// Importar componentes album
import { AlbumAddComponent } from './components/album-add.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'misdatos', component: UserEditComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: 'add-artist', component: ArtistAddComponent},
    {path: 'edit-artist/:id', component: ArtistEditComponent},
    {path: 'artist/:id', component: ArtistDetailComponent},
    {path: 'add-album/:artist', component: AlbumAddComponent},
    {path: '**', component: HomeComponent}
];

export const AppRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
