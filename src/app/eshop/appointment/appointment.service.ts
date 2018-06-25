import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private afs: AngularFirestore) { }

  search_firestore(keyword) {
    console.log('in search_firestore..');

    return this.afs.firestore.collection('appointments').get().then(querySnapshot => querySnapshot.docs
    );
  }

}
