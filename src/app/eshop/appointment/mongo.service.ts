import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MongoService {

  url = 'http://localhost:8080';

  dbName = 'kallisto';


  constructor(private http: HttpClient) {

  }

  getAppointment() {
    return this.http.get(this.url);
  }

  getDailyAppointments(d: Date) {
    console.log('in getDailyAppointments ' + d);
    return this.http.get(this.url + '/day/' + d);
  }

  getWeeklyAppointments(d: Date) {
    console.log('in getWeeklyAppointments ' + d);
    return this.http.get(this.url + '/week/' + d);
  }
}

export interface Appointment {
    name: string;
    surname: string;
    phone: string;
    date: Date;
    type: string;
  }
