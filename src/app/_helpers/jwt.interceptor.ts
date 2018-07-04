import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${access_token}`
                }
            });
        }
        if (request.body && request.body.refresh_requested) {
          const refresh_token = localStorage.getItem('refresh_token');
          if (refresh_token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${refresh_token}`
              }
            });
          }
        }

        return next.handle(request);
    }
}
