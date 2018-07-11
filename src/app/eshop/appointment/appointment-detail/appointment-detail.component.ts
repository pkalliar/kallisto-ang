import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Appointment, ApptCat } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { Location } from '@angular/common';

import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';




@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pk-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit {

  @Input() token: Appointment;
  isEdit = false;
  id = '';
  fromTime: NgbTimeStruct;
  toTime: NgbTimeStruct;

  categories: Array<ApptCat> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: AppointmentService
  ) { }

  save() {
    console.log('saving app..');
    console.log(JSON.stringify(this.token));

      this.token.start_time.setHours(this.fromTime.hour);
      this.token.start_time.setMinutes(this.fromTime.minute);
      this.token.end_time.setHours(this.toTime.hour);
      this.token.end_time.setMinutes(this.toTime.minute);

    const toSave = {
      name: this.token.name,
      start_time: this.token.start_time,
      end_time: this.token.end_time,
      category: null
    };
    if (this.token.category !== undefined) {
      toSave.category = JSON.parse(JSON.stringify(this.token.category));
    }
    if (this.id === 'new') {
      this.service.save(toSave).then(doc => {
        console.log('id = ' + doc.id);
        this.router.navigate(['/eshop/appointments/' + doc.id + '/edit']);
      });
    } else {
      this.service.update(this.id, toSave);
    }
  }


  ngOnInit() {
    this.token = new Appointment();
    // this.time = {hour: 13, minute: 30, second: 0};
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

      this.service.get_categories().then(response => {
        response.forEach((doc) => {
          console.log(doc.id + ' : ' + doc.get('name'));
          const a = new ApptCat(doc.id, doc.get('name'));
          this.categories.push(a);
        });
        this.token.category = this.categories[0];
      });

      if (this.id === 'new') {
        console.log('preparing new appointment');
        this.token.start_time = new Date();
        this.token.end_time = new Date();
        this.token.category = this.categories[0];
      } else {
        this.service.get(this.id).then(token => {
          this.token.id = token.id;
          this.token.name = token.get('name');
          this.token.start_time = new Date((token.get('start_time').seconds * 1000));
          this.token.end_time = new Date((token.get('end_time').seconds * 1000));
          if (token.get('category') !== undefined) {
            this.token.category = new ApptCat(token.get('category').id, token.get('category').name);
          }


          this.fromTime = {
            hour: this.token.start_time.getHours(),
            minute: this.token.start_time.getMinutes(),
            second: 0
          };
          this.toTime = {
            hour: this.token.end_time.getHours(),
            minute: this.token.end_time.getMinutes(),
            second: 0
          };
          console.log(JSON.stringify(this.token));
        });
      }


    });


    if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }

  }



}
