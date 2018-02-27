import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { environment } from '../../environments/environment';



@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService, private http: Http) { }

    canActivate() {
        if ( this.authService.isLoggedIn() ) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }

    handleError(error) {
        if (error.status === 401) {window.location.assign('/login'); }
        return;
    }

    prepareReq() {
        let server_url = '';
        const myheaders = new Headers({ 'apikey': localStorage.apikey });
        if (localStorage['server_url'] !== undefined) { server_url = localStorage['server_url']; }
    }

    get(url) {
        // let server_url = '';
        const myheaders = new Headers({ 'apikey': localStorage.apikey });
        // if (localStorage['server_url'] !== undefined) { server_url = localStorage['server_url']; }
        return this.http.get(environment.apiurl + url, {headers: myheaders}).
          subscribe(
            error => this.handleError(error) // error path
        );
    }

    delete(url) {
        let server_url = '';
        const myheaders = new Headers({ 'apikey': localStorage.apikey });
        if (localStorage['server_url'] !== undefined) { server_url = localStorage['server_url']; }
        return this.http.delete(server_url + url, {headers: myheaders}).
          subscribe(
            error => this.handleError(error) // error path
        );
    }


}
