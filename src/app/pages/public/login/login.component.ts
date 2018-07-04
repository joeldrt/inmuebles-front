import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

import { AuthenticationService } from '../../../_services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  error_message: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          switch (error.status) {
            case 0: {
              this.error_message = 'Error de comunicación con el servidor';
              break;
            }
            case 401: {
              this.error_message = 'Nombre de usuario o contraseña incorrecta';
              break;
            }
            default: {
              this.error_message = 'Error no conocido';
              break;
            }
          }
          console.log(error);
          this.loading = false;
        });
  }

  closeAlert() {
    this.error_message = null;
  }
}

