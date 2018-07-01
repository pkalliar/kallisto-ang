import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Appointment } from './appointment';

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

  get(id) {
    console.log('in get..');

    return this.afs.firestore.collection('appointments').doc(id).get();

  }
}
