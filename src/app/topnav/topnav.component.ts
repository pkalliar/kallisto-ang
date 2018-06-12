import { Component, OnInit, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

// my comment on Monday morning
@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
  providers: []
})

@Injectable()
export class TopNavComponent implements OnInit {
  title = 'kallisto';
  countdown = '';
  isLoggedIn = false;
  ttposition = 'below';
  username = '';
  nowDate = '';
  authDomain = '';



  constructor(private httpClient: HttpClient, private authService: AuthService
    , private router: Router, private route: ActivatedRoute, private authGuard: AuthGuard) {
    this.authService = authService;

    authService.user.subscribe(
      (user) => {
        if (user) {

          console.log(JSON.stringify(user));
          user.getIdTokenResult().then((res) => {
            console.log('Write succeeded!' + res.expirationTime);
          }

          );
        } else {
        }
      }
    );
  }




  ngOnInit(): void {
    console.log('initializing app..');

    moment.locale('el');
    if (localStorage.isLoggedIn) {
      this.isLoggedIn = JSON.parse(localStorage.isLoggedIn);
      if (this.isLoggedIn === true) {
        this.username = localStorage.username;
      } else {
        this.isLoggedIn = false;
      }
    }


    // setInterval(this.countdownToLogout(), 30); // every 5 minutes (300000)
    setInterval(() => this.countdownToLogout(), 1 * 1000);
    // setInterval(() => this.pingHeroku(this.http), 5 * 1000);

  }

    pingHeroku = function(http) {
      console.log('pinging.. pingHeroku');
      // http.get('https://kallisto-backend.herokuapp.com/');
    };

    login() {
      this.route.paramMap.subscribe((params: ParamMap) => console.log(params.get('id')));

      console.log('current path: ' + location.pathname);
      console.log('current path: ' + encodeURIComponent(location.pathname));
      // if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }

      this.router.navigate(['/login', { then: location.pathname }]);
    }

    refresh = function() {
      this.httpClient.get(environment.apiurl + '/api/refresh')
      // .toPromise()
      // .then(function(resp: any) {
      //   console.log('refreshing : ' + JSON.stringify(resp) );
      // })
      // .catch(this.handleError);
      .subscribe(
        resp => {
          console.log('1 ' + resp);
        },
        err => console.log('2 ' + err)
      );
    };

    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }

    logout = function() {
      // this.httpClient.get(environment.apiurl + '/api/authenticate/logout').toPromise()
      // .then(function(resp: any) {
      //   console.log('refreshing : ' + JSON.stringify(resp) );
      // });
      this.authService.logout();
    };

  countdownToLogout = function() {

    // console.log(this.authService.user);

      // var datePattern = "YYYY-MM-DD HH:mm:ss Z";
      if (localStorage.isLoggedIn) {
        this.isLoggedIn = JSON.parse(localStorage.isLoggedIn);
      }
      if (this.isLoggedIn === true) {
        const d = new Date(JSON.parse(localStorage.apikey_expires));
        const authExpiration = moment(d);
        const previousPollTime = moment();

        this.nowDate = previousPollTime.format('LLLL');
        this.timeoutDate = authExpiration.format('LLLL');

        console.log('this.timeoutDate ' + this.timeoutDate);

        const pollInnterval = 5;

        const b = moment();
        const diffSec = authExpiration.diff(b, 'seconds');
        const diffMin = authExpiration.diff(b, 'minutes');
        const diffSec2 = diffSec - diffMin * 60;

        if (diffSec > 0) {
            let divider = ':', frontDiv = '';
            if (diffSec2 < 10) {frontDiv = '0' + frontDiv; }
            if (diffSec2 < 10) {divider = divider + '0'; }
            this.countdown = diffMin + divider + diffSec2;
            localStorage.isLoggedIn = true;
            this.username = localStorage.username;
        } else {
          this.countdown = '';
          this.username = '';
          localStorage.isLoggedIn = false;
            // $scope.logout();
        }
        this.isLoggedIn = JSON.parse(localStorage.isLoggedIn);
      }
    };
}



