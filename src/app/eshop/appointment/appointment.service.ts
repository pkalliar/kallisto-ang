import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Appointment, ApptCat, CreationData } from './appointment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private afs: AngularFirestore) { }

  search_firestore(keyword: string, date1: Date, date2: Date, cat: ApptCat) {
    console.log('in search_firestore.. ' + cat.name);

    const appointmentsRef = this.afs.firestore.collection('appointments');

    // const query = appointmentsRef.where('name', '>=', 'Γαμ');

    const query = appointmentsRef
    .where('start_time', '>=', date1)
    .where('start_time', '<', date2);
    // .where('category.id', '==', cat.id);

    // query = query.where('start_time', '>=', new Date('July 01, 2018'));

    return query.get().then(querySnapshot => querySnapshot.docs);
  }

  getFreeAppointmentsPerDay(date1: Date, cat: ApptCat) {
    // console.log('in getFreeAppointmentsPerDay.. d1=' + JSON.stringify(date1));

    const date2 = moment(date1).add(1, 'd').hour(0).minute(0).second(0).toDate();

    // console.log('in getFreeAppointmentsPerDay.. d2=' + JSON.stringify(date2));

    const appointmentsRef = this.afs.firestore.collection('appointments');

    const query = appointmentsRef
    .where('start_time', '>=', date1)
    .where('start_time', '<', date2)
    .where('category.id', '==', cat.id);

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
    appt.durationMinutes = token.get('durationMinutes');
    // appt.end_time = new Date((token.get('end_time').seconds * 1000));
    if (token.get('category') !== undefined) {
      appt.category = new ApptCat(token.get('category').id, token.get('category').name);
    } else {
      appt.category = new ApptCat('', '');
    }
    // console.log(JSON.stringify(appt));
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

    let numWorkDays = 0;
    const currentDate = new Date(data.fromDate);
    while (currentDate <= data.toDate) {
        // Skips Sunday and Saturday
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            numWorkDays++;
            console.log(currentDate.toDateString() + '..............' + currentDate.getDay());
            const currentApp = moment(currentDate).hour(data.fromTime.hour).minute(data.fromTime.minute).second(0);
            const lastApp = moment(currentDate).hour(data.toTime.hour).minute(data.toTime.minute).second(0);
            while (currentApp.isBefore(lastApp)) {
              // console.log(currentApp.toLocaleString());

              const toSave = {
                start_time: currentApp.toDate(),
                durationMinutes: data.appointmentDuration,
                // end_time: currentApp.add(data.appointmentDuration, 'minutes').toDate(),
                category: null
              };
              if (data.category !== undefined) {
                toSave.category = JSON.parse(JSON.stringify(data.category));
              }

              // console.log(toSave);
              this.afs.firestore.collection('appointments').add(toSave);

              currentApp.add(data.appointmentDuration, 'm');
            }


        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

  }

  deleteAppointments(data: CreationData) {

  }

}


