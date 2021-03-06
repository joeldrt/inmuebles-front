import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

// layout components
import {
  PrivateComponent,
  HeaderComponent,
  FooterComponent,
  MenuComponent,
  SettingsComponent,
  ContentHeaderComponent,
} from './layouts/private';

import {
  PublicComponent,
} from './layouts/public';

// pages
import { LoginComponent } from './pages/public/login/login.component';
import { InmueblesComponent } from './pages/private/inmuebles/inmuebles.component';

// services
import { AuthGuard } from './_guard/auth.guard';
import {
  AlertService,
  AuthenticationService,
  AccountService,
  InmuebleService,
  ToasterService,
  ImagenService,
  UserService,
} from './_services';

// helpers
import { JwtInterceptor } from './_helpers';
import { UsuariosComponent } from './pages/private/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentHeaderComponent,
    MenuComponent,
    SettingsComponent,
    PrivateComponent,
    PublicComponent,
    LoginComponent,
    InmueblesComponent,
    UsuariosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModalModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    AccountService,
    InmuebleService,
    ImagenService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    ToasterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
