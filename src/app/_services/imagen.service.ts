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

  upload(inmueble_image_envelopes: InmuebleImageEnvelope[], inmueble_id: any): Observable<HttpResponse<any>> {
    const sending_object = { 'files': inmueble_image_envelopes, 'inmueble_id': inmueble_id };
    return this.http.post<any>(this.resourceUrl + '/upload', sending_object, {observe: 'response' });
  }

  updateList(url_list: [string], inmueble_id: any): Observable<HttpResponse<any>> {
    const sending_object = { 'url_list': url_list, 'inmueble_id': inmueble_id };
    return this.http.post<any>(this.resourceUrl + '/update_list', sending_object, { observe: 'response' });
  }

  delete(inmueble_id: string, foto_path: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.resourceUrl + '/delete/' + inmueble_id + '/' + foto_path, { observe: 'response'});
  }
}
