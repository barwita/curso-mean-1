import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Importar componentes de usuario
import { UserEditComponent } from './components/user-edit.component';

const appRoutes: Routes = [
    {path: '', component: UserEditComponent},
    {path: 'misdatos', component: UserEditComponent},
    {path: '**', component: UserEditComponent},
];

export const AppRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
