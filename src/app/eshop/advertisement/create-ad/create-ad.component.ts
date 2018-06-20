import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Advertisement } from '../advertisement';

@Component({
  selector: 'pk-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  @Input() ad: Advertisement;

  user_uid: String;

  constructor(private afs: AngularFirestore, private _firebaseAuth: AngularFireAuth) {

    _firebaseAuth.authState.subscribe((user) => {if (user) { this.user_uid = user.uid; } });
  }

  ngOnInit() {
    this.ad = new Advertisement();
  }

  createAd() {
    console.log('ad is ' + JSON.stringify(this.ad));
    this.ad.user_uid = this.user_uid;
    const id = this.afs.createId();
    this.afs.collection('advertisements').doc(id).set(Object.assign({}, this.ad))
    .then(function() {
      console.log('Document successfully written!');
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });

  }

}
