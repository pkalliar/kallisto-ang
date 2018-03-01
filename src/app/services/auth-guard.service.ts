import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';



@Injectable()
export class AuthGuard implements CanActivate {

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'apikey': localStorage.apikey
        })
      };

    constructor(private router: Router, private authService: AuthService, private http: HttpClient) { }

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

    // get(url) {
    //     // let server_url = '';
    //     const myheaders = new Headers({ 'apikey': localStorage.apikey });
    //     // if (localStorage['server_url'] !== undefined) { server_url = localStorage['server_url']; }
    //     return this.http.get(environment.apiurl + url, {headers: myheaders}).
    //       subscribe(
    //         error => this.handleError(error) // error path
    //     );
    // }

    get(url) {
        const myheaders = new Headers({ 'apikey': localStorage.apikey });

        return this.http.get<any>(environment.apiurl + url, this.httpOptions)
        .subscribe(
            // headers => console.log(headers),
            data => console.log(data),
            err => console.log(err)
          );
                //    .toPromise()
                //    .then(function(response: any) {
                //         console.log('response: ' + JSON.stringify(response));
                //         return response;
                //    })
                //    .catch(this.handleError);
    }

    delete(url) {
        let server_url = '';
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'apikey': localStorage.apikey
            })
          };

        if (localStorage['server_url'] !== undefined) { server_url = localStorage['server_url']; }
        return this.http.delete(server_url + url, httpOptions).
          subscribe(
            error => this.handleError(error) // error path
        );
    }


}
