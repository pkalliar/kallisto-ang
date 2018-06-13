import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { Headers, Http } from '@angular/http';
import * as moment from 'moment';

import { AuthGuard } from './auth-guard.service';

import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  private app: firebase.app.App;
  private userDetails: firebase.User = null;
  public idTokenResult: Promise<firebase.auth.IdTokenResult>;


  constructor(private _firebaseAuth: AngularFireAuth, private router: Router, private http: Http) {
      this.user = _firebaseAuth.authState;

      this.user.subscribe(
        (user) => {
          if (user) {
            this.userDetails = user;
            this.app = this._firebaseAuth.auth.app;
            this.idTokenResult = user.getIdTokenResult();
            console.log(this.userDetails);
          } else {
            this.userDetails = null;
          }
        }
      );
  }

  signInWithTwitter() {
      return this._firebaseAuth.auth.signInWithPopup(
        new firebase.auth.TwitterAuthProvider()
      );
  }

  signInWithFacebook() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }

  signInWithGoogle() {
    // return this._firebaseAuth.auth.signInWithPopup(
    //   new firebase.auth.GoogleAuthProvider()
    // );
     this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider())
      .then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // console.log(user);
      console.log('expirationTime: ' + JSON.stringify(result));
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  }



  signInEmail(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signInUsername(user) {
    // const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    // return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
    // return this.http.post(environment.apiurl + '/api/authenticate/login', user)
    // return this.http.post(environment.apiurl + '/api/login/json', user)
    // return this.http.post(environment.apiurl + '/apiV2/users/login', user)
    return this.http.post(environment.apiurl + '/sec/users/login', user)
    .toPromise()
    .then(response => response.json());
    // .catch(this.handleError);
  }

  isLoggedIn() {
  if (this.userDetails == null ) {
      return false;
    } else {
      return true;
    }
  }


  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['/']));
  }







}
