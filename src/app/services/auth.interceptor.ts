import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpHeaders,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log(request.method + '-INTERCEPT request headers: ' + JSON.stringify(event));

    // const headers = new HttpHeaders().set('intercept', localStorage.apikey);



    // console.log('intercept ' + request.url);

    if (request.url.startsWith('http://res.cloudinary.com/')
    || request.url.startsWith('https://api.cloudinary.com/')
    || request.url.startsWith('https://res.cloudinary.com/')
    || request.url.startsWith('https://geocoder.api.here.com/')
    || request.url.startsWith('http://autocomplete.geocoder.api')
    ) {
      return next.handle(request);
    } else {
      const headers = new HttpHeaders({
        'intercept': 'token 123',
        'apikey': localStorage.apikey,
        'Content-Type': 'application/json'
      });

      const cloneReq = request.clone({headers});

      return next.handle(cloneReq).pipe(
        tap((event: HttpEvent<any>) => {

          console.log('event: ' + event);
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
            // console.log('INTERCEPT headers: ' + JSON.stringify(event));
            const result: string = event.headers.get('result');
            console.log('result: ' + result);
            const apikey_expires: string = event.headers.get('apikey_expires');
            console.log('apikey_expires: ' + apikey_expires);
            if (apikey_expires.length > 1) {
              localStorage.apikey_expires =  apikey_expires;
            }
            const apikey: string = event.headers.get('apikey');
            if (apikey !== null) {
              localStorage.apikey =  apikey;
            }
            console.log('response: ' + JSON.stringify(event));
          }
        }, (err: any) => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // redirect to the login route
              // or show a modal
            }

          }
        }));


    }




  }
}
