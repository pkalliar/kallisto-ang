import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = {
      email: '',
      password: ''
    };
  }

  signInWithTwitter() {
      this.authService.signInWithTwitter()
      .then((res) => {
          this.router.navigate(['skroutz']);
        })
      .catch((err) => console.log(err));
    }

    signInWithFacebook() {
      this.authService.signInWithFacebook()
      .then((res) => {
          this.router.navigate(['skroutz']);
        })
      .catch((err) => console.log(err));
    }

    signInWithEmail() {
      this.authService.signInEmail(this.user.email, this.user.password)
          .then((res) => {
            console.log('res:' + res);
            this.router.navigate(['skroutz']);
          })
          .catch((err) => console.log('error: ' + err));
    }

    signInWithGoogle() {
      this.authService.signInWithGoogle()
      .then((res) => {
         console.log('res:' + JSON.stringify(res));
          this.router.navigate(['skroutz']);
        })
      .catch((err) => console.log(err));
    }

    signInWithUsername() {
      this.authService.signInUsername(this.user)
          .then((res) => {
            console.log(res);
            this.router.navigate(['skroutz']);
          })
          .catch((err) => console.log('error: ' + err));
    }

}
