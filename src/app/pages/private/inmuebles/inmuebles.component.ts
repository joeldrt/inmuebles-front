import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Inmueble } from '../../../_models';
import { InmuebleService, AccountService, AuthenticationService } from '../../../_services';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.scss']
})
export class InmueblesComponent implements OnInit {
  inmuebles: Inmueble[];
  inmueble_borrar_id: string;

  constructor(
    private inmuebleService: InmuebleService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.findAll();
  }

  reload() {
    this.findAll();
  }

  private findAll() {
    this.inmuebleService.getAll().subscribe(
      (response: HttpResponse<Inmueble[]>) => {
        this.inmuebles = response.body;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  setIdToDelete(inmueble_id: string) {
    this.inmueble_borrar_id = inmueble_id;
  }

  clearIdToDelete() {
    this.inmueble_borrar_id = null;
  }

  delete() {
    if (!this.inmueble_borrar_id) {
      return;
    }
    this.inmuebleService.delete(this.inmueble_borrar_id).subscribe(
      (response) => {
        this.findAll();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401 && this.accountService.isAccountPresent()) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          refreshcall.subscribe(
            value => {
              // call method again after refreshing token
              this.delete();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        }
      });
  }
}
