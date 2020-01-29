import { Component, OnInit } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

import { User } from '../security/users/user';

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
  private itemDoc: AngularFirestoreDocument<User>;
  item: Observable<User>;

  intViewportWidth = document.documentElement.clientWidth;

  constructor(private afStorage: AngularFireStorage, public authService: AuthService, private afs: AngularFirestore) {
    authService.user.subscribe(
      (user) => {
        if (user) {
          this.uid = user.uid;
        }
      });


      this.itemDoc = afs.doc<User>('users/04racqPXdVPEtkeXeUiV');
      this.item = this.itemDoc.valueChanges();
      this.item.subscribe(
        (user) => {
          if (user) {
            console.log(user);
          }
        }
      );
   }

  ngOnInit(): void {
  }

  upload(event) {
    const f = event.target.files[0];
    console.log( 'user.uid ' + this.uid  + ' read file ' + f.name);
    // if (window.FileReader) {
      // FileReader are supported.
      this.getAsText(f);
  // } else {
      // alert('FileReader are not supported in this browser.');
  // }

    // this.afStorage.upload('user/' + this.uid + '/' + event.target.files[0].name, event.target.files[0]);
  }

  getAsText(fileToRead) {
    const reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = this.loadHandler;
    reader.onerror = this.errorHandler;
  }

  loadHandler(event) {
    const csv = event.target.result;
    this.processData(csv);
  }

  processData(csv) {
    const allTextLines = csv.split(/\r\n|\n/);
    const lines = [];
      for (let i = 0; i < allTextLines.length; i++) {
        const data = allTextLines[i].split(';');
        const tarr = [];
              for (let j = 0; j < data.length; j++) {
                  tarr.push(data[j]);
              }
              lines.push(tarr);
      }
    console.log(lines);
  }

  errorHandler(evt) {
    if (evt.target.error.name === 'NotReadableError') {
        alert('Cannot read file !');
    }
  }

}



