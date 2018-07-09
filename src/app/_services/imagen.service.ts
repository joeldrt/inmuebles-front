import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { InmuebleImageEnvelope } from '../_models';

@Injectable()
export class ImagenService {

  private resourceUrl;

  constructor(
    private http: HttpClient
  ) {
    this.resourceUrl = environment.API_URL + 'api/foto';
  }

  upload(inmueble_image_envelope: InmuebleImageEnvelope): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl + '/upload', inmueble_image_envelope, {observe: 'response'});
  }
}
