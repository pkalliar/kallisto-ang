import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'pk-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  ad = null;
  user_uid: String;

  constructor(private afs: AngularFirestore, private _firebaseAuth: AngularFireAuth) {

    _firebaseAuth.authState.subscribe((user) => {if (user) { this.user_uid = user.uid; } });
  }

  ngOnInit() {
    this.ad = {};
  }

  createAd() {
    console.log('ad is ' + JSON.stringify(this.ad));
    this.ad.use_id = this.user_uid;
    const id = this.afs.createId();
    this.afs.collection('advertisements').doc(id).set(this.ad)
    .then(function() {
      console.log('Document successfully written!');
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });

  }

}
