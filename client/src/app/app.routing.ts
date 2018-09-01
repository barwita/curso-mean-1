import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Importar componentes de usuario
import { UserEditComponent } from './components/user-edit.component';

// Importar artistas
import { ArtistListComponent } from './components/artist-list.component';

const appRoutes: Routes = [
    {
        path: '', 
        redirectTo: '/artists/1',
        pathMatch: 'full'
    },
    {path: 'misdatos', component: UserEditComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: '**', component: ArtistListComponent},
];

export const AppRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
