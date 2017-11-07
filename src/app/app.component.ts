import { Component, OnInit } from '@angular/core';
import { Protocol } from './protocols/protocol';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';


// my comment on Monday morning
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  title = 'Angular pankal app';


  ngOnInit(): void {
    console.log('initializing app..');
  }


  countdownToLogout = function(){

      var interval = 1000;
      
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
    }

}



