import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Appointment } from '../appointment';
import { TableDatabase, TableDataSource } from '../../../utilities';
import { MatSort } from '@angular/material';
import { AppointmentService } from '../appointment.service';
import { FormControl } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const now = new Date();
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  selected: Appointment;

  entlist: Appointment[];
  aps: Array<Appointment> = [];

  searchTerm: FormControl = new FormControl();

  currentFilter = '';
  displayedColumns = ['name', 'start_time', 'end_time', 'actions'];

  tableDatabase = new TableDatabase();
  dataSource: TableDataSource | null;
  @ViewChild(MatSort) sort: MatSort;


  date1 = new FormControl(new Date());
  date2 = new FormControl(new Date());

  hoveredDate: NgbDateStruct;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  model: NgbDateStruct;
  date: {year: number, month: number};
  // fromTime: NgbTimeStruct;
  // toTime: NgbTimeStruct;
  fromTime = {hour: 9, minute: 0};
  toTime = {hour: 9, minute: 30};
  minuteStep = 15;
  hourStep = 1;

  constructor(private service: AppointmentService, calendar: NgbCalendar) {

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

    const d = new Date();
    d.setDate(d.getDate() + 30);
    this.date2 = new FormControl(d);



    // this.date1 = new FormControl(calendar.getToday());
    // this.date2 = new FormControl(calendar.getNext(calendar.getToday(), 'd', 10));
  }

  ngOnInit() {
    this.filter();
    this.dataSource = new TableDataSource(this.tableDatabase, this.sort);

  }

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  onDateSelection(date: NgbDateStruct) {
    console.log('selected ' + JSON.stringify(this.model));
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month || this.isWeekend(date);
  }

  filter() {
    console.log('filtering with parameters: ' + JSON.stringify(this.fromTime) + JSON.stringify(this.toTime));
    // let d1: Date;
    const d1: Date = this.date1.value;
    d1.setHours(this.fromTime.hour);
    d1.setMinutes(this.fromTime.minute);
    d1.setSeconds(0);
    const d2: Date = this.date2.value;
    d2.setHours(this.toTime.hour);
    d2.setMinutes(this.toTime.minute);
    d2.setSeconds(0);
    console.log('filtering with date: ' + d1 + '' + d2);


    this.service.search_firestore(this.searchTerm.value, d1, d2).then(response => {
      this.aps  = [];
      this.tableDatabase.clear();
      response.forEach((doc) => {
        const a = new Appointment();

        a.id = doc.id;
        a.name = doc.get('name');
        console.log(new Date((doc.get('start_time').seconds * 1000)));
        a.start_time = new Date((doc.get('start_time').seconds * 1000));
        a.end_time = new Date((doc.get('end_time').seconds * 1000));

        this.aps.push(a);
        this.tableDatabase.addLine(a);

        console.log(doc.get('body'));
            console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
      });
    });
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

}
