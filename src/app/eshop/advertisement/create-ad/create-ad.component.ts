import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Advertisement } from '../advertisement';
import { AdsService } from '../advertisements.service';

@Component({
  selector: 'pk-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  @Input() ad: Advertisement;
  f: File;
  user_uid: String;
  adv_id: string;

  constructor(private afs: AngularFirestore,
    private _firebaseAuth: AngularFireAuth, private service: AdsService) {

    _firebaseAuth.authState.subscribe((user) => {if (user) { this.user_uid = user.uid; } });
  }

  ngOnInit() {
    this.ad = new Advertisement();
  }

  upload(event) {
    this.f = event.target.files[0];

    this.service.upload(this.user_uid, this.adv_id, this.f, true);
  }

  createAd() {
    console.log('ad is ' + JSON.stringify(this.ad));
    this.ad.user_uid = this.user_uid;
    this.adv_id = this.afs.createId();

    this.afs.collection('advertisements').doc(this.adv_id).set(Object.assign({}, this.ad))
    .then(function() {
      console.log('Document successfully written!');

    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });

  }

}
