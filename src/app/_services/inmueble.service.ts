import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Inmueble } from '../_models';
import { createRequestOption } from '../_helpers/request-util';


@Injectable()
export class InmuebleService {

  private resourceUrl;

  constructor(
    private http: HttpClient
  ) {
    this.resourceUrl = environment.API_URL + 'api/inmueble';
  }

  create(inmueble: Inmueble): Observable<HttpResponse<Inmueble>> {
    return this.http.post<Inmueble>(this.resourceUrl, inmueble, { observe: 'response' });
  }

  update(inmueble: Inmueble): Observable<HttpResponse<Inmueble>> {
    return this.http.put<Inmueble>(this.resourceUrl, inmueble, { observe: 'response' });
  }

  getAll(): Observable<HttpResponse<Inmueble[]>> {
    return this.http.get<Inmueble[]>(this.resourceUrl, { observe: 'response' });
  }

  find(search: string): Observable<HttpResponse<Inmueble[]>> {
    return this.http.get<Inmueble[]>(`${this.resourceUrl}/${search}`, { observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
