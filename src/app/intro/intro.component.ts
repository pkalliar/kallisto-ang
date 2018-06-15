import { Component, OnInit } from '@angular/core';

import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

// import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



// my comment on Monday morning
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
  providers: []
})
export class IntroComponent implements OnInit {

  uid: String;

  intViewportWidth = document.documentElement.clientWidth;

  constructor(private afStorage: AngularFireStorage, public authService: AuthService) {
    authService.user.subscribe(
      (user) => {
        if (user) {
          this.uid = user.uid;
        }
      });


   }

  ngOnInit(): void {
    console.log('initializing app..');
  }

  upload(event) {
    console.log( 'user.uid ' + this.uid );
    this.afStorage.upload(this.uid + '/' + event.target.files[0].name, event.target.files[0]);
  }
}



