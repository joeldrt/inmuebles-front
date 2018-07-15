import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/';

import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable()
export class UserService {

  private resourceUrl;

  constructor(
    private http: HttpClient,
  ) {
    this.resourceUrl = environment.API_URL + 'api/';
  }

  register(user: User): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl + 'registration', user, { observe: 'response' });
  }

  edit(user: User): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.resourceUrl + 'users', user, { observe: 'response' });
  }

  delete(username: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.resourceUrl + 'users/' + username, { observe: 'response' });
  }

  getAll(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.resourceUrl + 'users', { observe: 'response' });
  }

  getAllAvailableRoles(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + 'roles', { observe: 'response' });
  }

  adminChangePassword(username: string, password: string): Observable<HttpResponse<any>> {
    const object = {
      'username': username,
      'password': password,
    };
    return this.http.post<any>(this.resourceUrl + 'admin/change_password', object, { observe: 'response' });
  }
}
