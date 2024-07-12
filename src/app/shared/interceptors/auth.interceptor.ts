import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from '@root/shared/services/utils/utils.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private readonly _http: HttpClient,
    private readonly _utilsService: UtilsService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = '';
    let currentUser: any = localStorage.getItem('currentUser');
    if (currentUser) {
      currentUser = JSON.parse(currentUser);
      token = currentUser['token'];
    }
    if (this._utilsService.token) {
      token = this._utilsService.token;
    }
    const newRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
      body: request.body
    });
    return next.handle(newRequest).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._utilsService.getTerms().subscribe(
              () => {
                location.reload();
              }
            );
          }
        }
        return throwError(err);
      })
    );
  }
  private callApi(url: string, method: string, body: any): Observable<any> {
    switch (method) {
      case 'get':
        return new Observable(obs => {
          this._http.get(url).subscribe(
            (res: any) => {
              obs.next(res);
              obs.complete();
            },
            (err: any) => {
              obs.error(err);
            }
          );
        });
      case 'post':
        return new Observable(obs => {
          this._http.post(url, body).subscribe(
            (res: any) => {
              obs.next(res);
              obs.complete();
            },
            (err: any) => {
              obs.error(err);
            }
          );
        });
    }
  }
}
