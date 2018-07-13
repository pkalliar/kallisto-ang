import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Appointment } from './appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private afs: AngularFirestore) { }

  search_firestore(keyword: string, date1: Date, date2: Date) {
    console.log('in search_firestore..');

    const appointmentsRef = this.afs.firestore.collection('appointments');

    // const query = appointmentsRef.where('name', '>=', 'Γαμ');

    const query = appointmentsRef.where('start_time', '>=', date1).where('start_time', '<', date2);

    // query = query.where('start_time', '>=', new Date('July 01, 2018'));

    return query.get().then(querySnapshot => querySnapshot.docs);
  }

  get_categories() {
    return this.afs.firestore.collection('appointment_categories').get().then(querySnapshot => querySnapshot.docs
    );
  }

  get(id) {
    console.log('in get..');
    return this.afs.firestore.collection('appointments').doc(id).get();
  }

  getApptFromToken(): AppointmentService {
    
  }

  update(id, token) {
    console.log('in save..');

    return this.afs.firestore.collection('appointments').doc(id).update(token);

  }

  save(token) {
    console.log('in save..');

    return this.afs.firestore.collection('appointments').add(token);

  }
}
