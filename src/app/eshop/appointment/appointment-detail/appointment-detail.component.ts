import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { Location } from '@angular/common';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


const now = new Date();

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pk-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit {

  @Input() token: Appointment;
  isEdit = false;

  model: NgbDateStruct;
  date: {year: number, month: number};

  typesOfShoes = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: AppointmentService
  ) { }

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
  }

  ngOnInit() {
    this.token = new Appointment();
    this.route.paramMap
    .switchMap((params: ParamMap) => this.service.get(params.get('id')))
    .subscribe(token => {
      this.token.id = token.id;
      this.token.name = token.get('name');
      this.token.start_time = new Date((token.get('start_time').seconds * 1000));
      this.token.end_time = new Date((token.get('end_time').seconds * 1000));

      console.log(JSON.stringify(this.token));
    });

    if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }

  }

}
