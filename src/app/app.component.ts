import { Component, OnInit, Injectable } from '@angular/core';
import { Protocol } from './protocols/protocol';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';
import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './services/auth.service';

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

  constructor(private http: Http, private httpClient: HttpClient, private authService: AuthService) {
    this.http = http;
    this.authService = authService;
  }




  ngOnInit(): void {
    console.log('initializing app..');

    // setInterval(this.pingHeroku(this.http), 30000); // every 5 minutes (300000)

  }

    pingHeroku = function(http) {
      console.log('pinging..');
      // http.get('https://kallisto-backend.herokuapp.com/');
    };

    logout = function(){
      this.authService.logout();
    };

  countdownToLogout = function(){

      const interval = 1000;
      // moment.locale('el');

      // var datePattern = "YYYY-MM-DD HH:mm:ss Z";

      // $scope.authExpiration = moment(localStorageService.get('apikey_expires'));
      // $scope.previousPollTime = moment();

      // interval(function(){
      //   $scope.authExpiration = moment(localStorageService.get('apikey_expires'));
      //   var pollInnterval = 5;

      //   var b = moment();
      //   var diffSec = $scope.authExpiration.diff(b, 'seconds');
      //   var diffMin = $scope.authExpiration.diff(b, 'minutes');
      //   var diffSec2 = diffSec - diffMin*60;
      //   if (diffSec2 < 10) {diffSec2 = "0"+diffSec2;}

      //   if(diffSec >= 45 && diffSec > 0){
      //       $scope.countdown = diffMin + ":" + diffSec2;
      //   }else if(diffSec <= 0 && diffSec < -2){
      //       console.log("Αποσυνδέεστε.." );
      //       $scope.countdown = 'Αποσυνδέεστε..1';
      //       $scope.logout();
      //   }else{
      //       console.log("Αποσυνδέεστε..2" );
      //       // $scope.logout();
      //   }
      //   var diffPollingSec = b.diff($scope.previousPollTime, 'seconds');
      //   if(diffPollingSec >= pollInnterval){
      //     //$scope.getServerEvents();
      //   }

      // }, interval);
    };
}



