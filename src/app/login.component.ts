import { Component, Input, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Headers, Http } from '@angular/http';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent implements OnInit{
    // @Input() login: Login = new Login();
    email = new FormControl('', [Validators.required, Validators.email]);
    username = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required]);

    private loginUrl = 'http://localhost:8090/login';

    constructor(
      private route: ActivatedRoute,
      private location: Location,
      private http: Http,
      private authService: AuthService
    ) {}

    ngOnInit(): void {

    }

    goBack(): void {
      this.location.back();
    }

    getErrorMessage( owner) {
      return  owner === 'username' && this.username.hasError('required') ? 'You must enter your username' :
              owner === 'password' && this.password.hasError('required') ? 'You must enter your password' :
              '';
    }

    logmein() {
      const login = new Login();
      login.username = this.username.value;
      login.password = this.password.value;
      console.log('do the login thing..' + JSON.stringify(login));

      this.authService.login(login).then( response => console.log('response is ..' + response));

    }

    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }

}


export class Login {
    username: string;
    password: string;
}