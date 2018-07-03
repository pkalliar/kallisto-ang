import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { Location } from '@angular/common';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';




@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pk-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit {

  @Input() token: Appointment;
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: AppointmentService
  ) { }



  ngOnInit() {
    this.token = new Appointment();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id === 'new') {
        console.log('preparing new appointment');
      } else {
        this.service.get(id).then(token => {
          this.token.id = token.id;
          this.token.name = token.get('name');
          this.token.start_time = new Date((token.get('start_time').seconds * 1000));
          this.token.end_time = new Date((token.get('end_time').seconds * 1000));
          console.log(JSON.stringify(this.token));
        });
      }


    });
    // this.route.paramMap
    // .switchMap((params: ParamMap) => this.service.get(params.get('id')))
    // .subscribe(token => {
    //   this.token.id = token.id;
    //   this.token.name = token.get('name');
    //   this.token.start_time = new Date((token.get('start_time').seconds * 1000));
    //   this.token.end_time = new Date((token.get('end_time').seconds * 1000));
    //   console.log(JSON.stringify(this.token));
    // });

    if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }

  }

}
