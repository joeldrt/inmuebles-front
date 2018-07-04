import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../_models';
import { environment } from '../../environments/environment';

@Injectable()
export class AccountService {
  private API_URL;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.API_URL = environment.API_URL;
  }

  getAccount(): Observable<User> {
    return this.http.get<User>(this.API_URL + 'api/account')
      .map(user => {
        if (user) {
          localStorage.setItem('account', JSON.stringify(user));
        }

        return user;
      });
  }

  isAccountPresent(): boolean {
    if (localStorage.getItem('account')) {
      return true;
    }
    return false;
  }

}
