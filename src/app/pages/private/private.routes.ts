import { Routes } from '@angular/router';
import { InmueblesComponent } from './inmuebles/inmuebles.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const PRIVATE_ROUTES: Routes = [
  { path: '', redirectTo: 'inmuebles', pathMatch: 'full'},
  { path: 'inmuebles', component: InmueblesComponent, data: { title: 'Inmuebles', breadcrumb: 'inmuebles' } },
  { path: 'usuarios', component: UsuariosComponent, data: { title: 'Usuarios', breadcrumb: 'usuarios' } },
];
