import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Importar home
import { HomeComponent } from './components/home.component';

// Importar componentes de usuario
import { UserEditComponent } from './components/user-edit.component';

// Importar artistas
import { ArtistListComponent } from './components/artist-list.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'misdatos', component: UserEditComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: '**', component: ArtistListComponent}
];

export const AppRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
