import { Component, OnInit } from '@angular/core';
import {Inmueble, User} from '../../../_models';
import { AccountService, AuthenticationService, UserService } from '../../../_services';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ToasterService } from '../../../_services/toaster.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  user_modal_window: NgbModalRef;

  current_account: User;

  loading = false;
  app_users: User[];

  roles: [string];

  refresh_already_performed = ['default', false];

  user_to_delete: string;

  current_user: User;

  user_modal_window_type: string;

  re_password: string;
  password_to_change: string;

  edit_password_user_candidate: string;

  constructor(
    private userService: UserService,
    private toasterService: ToasterService,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.current_user = new User();
  }

  ngOnInit() {
    this.current_account = this.accountService.getCurrentAccount();
    this.findAllUsers();
    this.findRoles();
  }

  private findRoles() {
    this.userService.getAllAvailableRoles().subscribe(
      (response: HttpResponse<any>) => {
        this.roles = response.body;
      },
      (error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed['roles']) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed['roles'] = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed['roles'] = true;
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.findRoles();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.refresh_already_performed['roles'] = false;
          this.roles = ['guest'];
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  reload() {
    this.findAllUsers();
  }

  private findAllUsers() {
    this.loading = true;
    this.userService.getAll().subscribe(
      (response: HttpResponse<User[]>) => {
        this.app_users = response.body;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed['find_all']) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed['find_all'] = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed['find_all'] = true;
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.findAllUsers();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.refresh_already_performed['find_all'] = false;
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
        this.loading = false;
      });
  }

  setUserToDelete(username: string) {
    this.user_to_delete = username;
  }

  clearUserToDelete() {
    this.user_to_delete = null;
  }

  delete() {
    if (!this.user_to_delete) {
      return;
    }
    this.userService.delete(this.user_to_delete).subscribe(
      (response) => {
        this.findAllUsers();
        this.clearUserToDelete();
        this.toasterService.success('El usuario fue borrado correctamente');
      },
      (error: HttpErrorResponse) => {
        // we add also status 500, because thats the status number when raising ExpiredSignatureError('Signature has expired')
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed['delete']) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed['delete'] = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed['delete'] = true;
          refreshcall.subscribe(
            value => {
              // call method again after refreshing token
              this.delete();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.refresh_already_performed['delete'] = false;
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  setNewUser() {
    this.current_user = new User();
    this.re_password = null;
  }

  openUserModal(content: any, user?: User) {
    if (!user) {
      this.setNewUser();
      this.user_modal_window_type = 'new';
    } else {
      this.current_user = Object.assign({}, user);
      this.user_modal_window_type = 'edit';
    }
    this.user_modal_window = this.modalService.open(content, { windowClass: 'in', backdropClass: 'digiallbackdrop'});
  }

  closeUserModal() {
    if (this.user_modal_window) {
      this.setNewUser();
      this.user_modal_window.close();
    }
  }

  save() {
    if (!this.current_user) {
      return;
    }
    this.userService.register(this.current_user).subscribe(
      (response: HttpResponse<any>) => {
        this.findAllUsers();
        this.setNewUser();
        this.toasterService.success('Usuario creado');
        this.closeUserModal();
      },
      (error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed['register']) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed['register'] = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed['register'] = true;
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.save();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.refresh_already_performed['register'] = false;
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  edit() {
    if (!this.current_user) {
      return;
    }
    this.userService.edit(this.current_user).subscribe(
      (response: HttpResponse<any>) => {
        this.findAllUsers();
        this.setNewUser();
        this.toasterService.success('Usuario editado');
        this.closeUserModal();
      },
      (error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed['edit']) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed['edit'] = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed['edit'] = true;
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.edit();
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.refresh_already_performed['edit'] = false;
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }

  setEditPasswordUserCandidate(username: string) {
    this.edit_password_user_candidate = username;
  }

  clearEditPasswordUserCandidate() {
    this.edit_password_user_candidate = null;
    this.re_password = null;
    this.password_to_change = null;
  }

  changeUserPassword(password: string) {
    if (!this.edit_password_user_candidate) {
      return;
    }
    this.userService.adminChangePassword(this.edit_password_user_candidate, password).subscribe(
      (response: HttpResponse<any>) => {
        this.findAllUsers();
        this.clearEditPasswordUserCandidate();
        this.toasterService.success('Password cambiado');
      },
      (error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 500)
          && this.accountService.isAccountPresent()
          && !this.refresh_already_performed['password']) {
          const refreshcall = this.authenticationService.refreshAccessToken();
          if (refreshcall === null) {
            this.refresh_already_performed['password'] = false;
            // nothing to do... we must perform a login... redirect to it
            this.router.navigate(['/login']);
          }
          this.refresh_already_performed['password'] = true;
          refreshcall.subscribe(
            value1 => {
              // call method again after refreshing token
              this.changeUserPassword(password);
            },
            (errorRefresh: HttpErrorResponse) => {
              // nothing to do... we must perform a login... redirect to it
              this.router.navigate(['/login']);
            });
        } else {
          this.refresh_already_performed['password'] = false;
          this.toasterService.error('Error: ' + error.status + ', ' + error.error.message);
        }
      });
  }
}
