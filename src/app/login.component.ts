import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{
    // @Input() login: Login = new Login();
    email = new FormControl('', [Validators.required, Validators.email]);
    username = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required]);

    constructor(
      private route: ActivatedRoute,
      private location: Location
    ) {}

    ngOnInit(): void {

    }

    goBack(): void {
      this.location.back();
    }

    getErrorMessage( owner) {
      return  owner == 'username' && this.username.hasError('required') ? 'You must enter your username' :
              owner == 'password' && this.password.hasError('required') ? 'You must enter your password' :
              '';
    }

    logmein() {
      var login = new Login();
      login.username = this.username.value;
      login.password = this.password.value;
      console.log('do the login thing..' + JSON.stringify(login));
    }

}


export class Login {
    username: string;
    password: string;
}