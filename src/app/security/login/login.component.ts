import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AuthService } from '../../services/auth.service';

import { UtilitiesService } from '../../services/utilities.service';


import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = null;
  test = 'gaga';

  constructor(private authService: AuthService, private router: Router,
    private utils: UtilitiesService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = {
      // email: '',
      password: ''
    };
  }

  signInWithTwitter() {
      this.authService.signInWithTwitter()
      .then((res) => {
          this.router.navigate(['']);
        })
      .catch((err) => console.log(err));
    }

    signInWithFacebook() {
      this.authService.signInWithFacebook()
      .then(result => { // Success
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;
        // The signed-in user info.
        // this.user = result.user;
        console.log('user ' + JSON.stringify(this.test));
        // console.log('expirationTime: ' + moment(this.user.expirationTime).format());
        this.router.navigate(['/intro']);

        },
        error => { // Error
                  // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log('errorMessage: ' + errorMessage);
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        }
      );
    }

    signInWithEmail() {
      this.authService.signInEmail(this.user.email, this.user.password)
          .then(result => { // Success
            this.router.navigate(['/intro']);
          })
          .catch((err) => console.log('error: ' + err));
    }

    signInWithGoogle() {
      this.authService.signInWithGoogle()
      .then(result => { // Success
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const token = result.credential.accessToken;
            // The signed-in user info.
            this.user = result.user;
            console.log('user ' + JSON.stringify(this.user));
            console.log('expirationTime: ' + moment(this.user.expirationTime).format());
            this.router.navigate(['/eshop']);

        },
        error => { // Error
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log('errorMessage: ' + errorMessage);
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
        }
      );

    }

    signInWithUsername() {
      this.authService.signInUsername(this.user)
          .then((res) => {
            console.log(res);
            if (res.result !== undefined) {
              const snackBarRef = this.snackBar.open(res.result, 'x', { duration: 2000 });
            } else {
              localStorage.apikey = res.apikey;
              // localStorage.apikey_expires = this.utils.parseJavaDate2ISO(res.apikey_expires);
              localStorage.apikey_expires = res.apikey_expires;
              localStorage.username = res.username;
              localStorage.isLoggedIn = true;
              this.router.navigate(['']);
            }

          })
          .catch((err) => console.log('error: ' + err));
    }

}
