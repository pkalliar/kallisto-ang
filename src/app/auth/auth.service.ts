import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import * as jwt_decode from 'angular2-jwt';
import { JwtHelper } from 'angular2-jwt';

export const TOKEN_NAME: string = 'jwt_token';


@Injectable()
export class AuthService {

  //private contactsUrl = 'http://127.0.0.1:8090/api/contacts';  // URL to web api
  private url: string = 'http://127.0.0.1:8090/api/babadoo';
  private headers = new Headers({ 'Content-Type': 'application/json' });

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http) { }

  getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = this.jwtHelper.decodeToken(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  login(user): Promise<string> {
    return this.http
      .post(`${this.url}`, JSON.stringify(user), { headers: this.headers })
      .toPromise()
      .then(res => res.text());
  }

}