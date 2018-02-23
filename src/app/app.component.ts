import { Component, OnInit, Injectable } from '@angular/core';
import { Protocol } from './protocols/protocol';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';
import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import * as moment from 'moment';

// my comment on Monday morning
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

@Injectable()
export class AppComponent implements OnInit {
  title = 'PKENERGY';
  countdown = '...';

  constructor(private http: Http, private httpClient: HttpClient, private authService: AuthService) {
    this.http = http;
    this.authService = authService;
  }




  ngOnInit(): void {
    console.log('initializing app..');

    moment.locale('el');

    // setInterval(this.countdownToLogout(), 30); // every 5 minutes (300000)
    setInterval(() => this.countdownToLogout(), 1 * 1000);
    // setInterval(() => this.pingHeroku(this.http), 5 * 1000);

  }

    pingHeroku = function(http) {
      console.log('pinging.. pingHeroku');
      // http.get('https://kallisto-backend.herokuapp.com/');
    };

    logout = function(){
      this.authService.logout();
    };

  countdownToLogout = function(){

      // var datePattern = "YYYY-MM-DD HH:mm:ss Z";

      const authExpiration = moment(localStorage.apikey_expires);
      const previousPollTime = moment();

      const pollInnterval = 5;

      const b = moment();
      const diffSec = authExpiration.diff(b, 'seconds');
      const diffMin = authExpiration.diff(b, 'minutes');
      const diffSec2 = diffSec - diffMin * 60;

      // console.log('authExpiration: ' + authExpiration.format());
      // console.log('b: ' + b.format());
      // if (diffSec2 < 10) {diffSec2 = '0' + diffSec2;}

        if (diffSec >= 45 && diffSec > 0) {
            let divider = ':', frontDiv = '';
            if (diffSec2 < 10) {frontDiv = '0' + frontDiv; }
            if (diffSec2 < 10) {divider = divider + '0'; }
            this.countdown = diffMin + divider + diffSec2;
        }else if (diffSec <= 0 && diffSec < -2) {
            console.log('Αποσυνδέεστε..' );
            this.countdown = 'Αποσυνδέεστε..1';
            // logout();
        }else {
            console.log('Αποσυνδέεστε..2' );
            // $scope.logout();
        }

        // console.log('pinging.. countdownToLogout ' + this.countdown);
      //   var diffPollingSec = b.diff($scope.previousPollTime, 'seconds');
      //   if(diffPollingSec >= pollInnterval){
      //     //$scope.getServerEvents();
        // }
    };
}



