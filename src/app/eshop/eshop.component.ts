import { Component, OnInit, ViewChild, ChangeDetectionStrategy  } from '@angular/core';
import { MatCalendar } from '@angular/material';

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

@Component({
  templateUrl: './eshop.component.html',
  styleUrls: ['./eshop.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EshopComponent implements OnInit {

  @ViewChild(MatCalendar) _datePicker: MatCalendar<Date>;

  model: NgbDateStruct;
  date: {year: number, month: number};

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
    // this._datePicker.selectedChange.subscribe(x => {
    //   console.log(x);
    // });
  }


}
