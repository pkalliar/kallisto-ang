import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpHeaders,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';


export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log(request.method + '-INTERCEPT request headers: ' + JSON.stringify(event));

    // const headers = new HttpHeaders().set('intercept', localStorage.apikey);

    const headers = new HttpHeaders({
      'intercept': 'token 123',
      'apikey': localStorage.apikey,
      'Content-Type': 'application/json'
    });



    const cloneReq = request.clone({headers});

    return next.handle(cloneReq).do((event: HttpEvent<any>) => {

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
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // redirect to the login route
          // or show a modal
        }

      }
    });
  }
}
