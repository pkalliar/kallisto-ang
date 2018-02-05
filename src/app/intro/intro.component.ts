import { Component, OnInit } from '@angular/core';

import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



// my comment on Monday morning
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
  providers: []
})
export class IntroComponent implements OnInit {
  title = 'PKENERGY';
  intViewportWidth = document.documentElement.clientWidth;

  ngOnInit(): void {
    console.log('initializing app..');
  }


  countdownToLogout = function(){

      const interval = 1000;
      // moment.locale('el');

      // var datePattern = "YYYY-MM-DD HH:mm:ss Z";

      // $scope.authExpiration = moment(localStorageService.get('apikey_expires'));
      // $scope.previousPollTime = moment();

      // $interval(function(){
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



