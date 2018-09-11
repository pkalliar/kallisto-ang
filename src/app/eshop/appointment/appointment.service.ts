import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Appointment, ApptCat, CreationData } from './appointment';
import * as moment from 'moment';

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

  getApptFromToken(token): Appointment {
    const appt: Appointment = new Appointment();
    appt.id = token.id;
    appt.firstname = token.get('firstname');
    appt.lastname = token.get('lastname');
    appt.start_time = new Date((token.get('start_time').seconds * 1000));
    appt.end_time = new Date((token.get('end_time').seconds * 1000));
    if (token.get('category') !== undefined) {
      appt.category = new ApptCat(token.get('category').id, token.get('category').name);
    } else {
      appt.category = new ApptCat('', '');
    }
    console.log(JSON.stringify(appt));
    return appt;
  }

  update(id, token) {
    console.log('in save..');

    return this.afs.firestore.collection('appointments').doc(id).update(token);

  }

  save(token) {
    console.log('in save..');

    return this.afs.firestore.collection('appointments').add(token);

  }

  createAppointments(data: CreationData) {
    console.log('in create..');

    const toSave = {
      start_time: data.fromDate,
      end_time: moment(data.toDate).add(30, 'minutes').toDate(),
      category: null
    };
    if (data.category !== undefined) {
      toSave.category = JSON.parse(JSON.stringify(data.category));
    }

    this.afs.firestore.collection('appointments').add(toSave);

  }

}
