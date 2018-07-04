import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {

  private API_URL;

  constructor(
    private http: HttpClient,
  ) {
    this.API_URL = environment.API_URL;
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.API_URL + 'api/login', { username: username, password: password })
      .map(token => {
        // login successful if there's a jwt token in the response
        if (token) {
          if (token.access_token) {
            // store access_token
            localStorage.setItem('access_token', token.access_token);
          }
          if (token.refresh_token) {
            // store refresh_token
            localStorage.setItem('refresh_token', token.refresh_token);
          }
        }

        return token;
      });
  }

  logout() {
    if (localStorage.getItem('access_token')) {
      return;
    }

    // revoke tokens in server
    this.http.post<any>(this.API_URL + 'api/logout/access', null).subscribe(
      value => {
        this.clearLocalStorage();
      },
      (error: HttpErrorResponse) => {
        this.clearLocalStorage();
      });
  }

  private clearLocalStorage() {
    // remove access_token from local storage to log user out
    localStorage.removeItem('access_token');
    // remove refresh_token from local storage to log user out
    localStorage.removeItem('refresh_token');
    // remove account from local storage to log user out
    localStorage.removeItem('account');
  }
}
