import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{
    @Input() login: Login = new Login();

    constructor(
      private route: ActivatedRoute,
      private location: Location
    ) {}

    ngOnInit(): void {

    }

    goBack(): void {
      this.location.back();
    }

}


export class Login {
    username: string;
    password: string;
}