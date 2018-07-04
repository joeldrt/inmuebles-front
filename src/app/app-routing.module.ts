import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './_guard/auth.guard';
import { PublicComponent } from './layouts/public/public.component';
import { PUBLIC_ROUTES } from './pages/public/public.routes';
import { PrivateComponent } from './layouts/private/private.component';
import { PRIVATE_ROUTES } from './pages/private/private.routes';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/inmuebles', pathMatch: 'full' },
  { path: '', component: PublicComponent, data: { breadcrumb: 'not-bc-page' }, children: PUBLIC_ROUTES },
  { path: '', component: PrivateComponent, canActivate: [AuthGuard], data: { breadcrumb: 'not-bc-page' }, children: PRIVATE_ROUTES },
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
