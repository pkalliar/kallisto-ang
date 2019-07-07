import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { Appointment, ApptCat, CreationData, DailyData } from '../appointment';
import { TableDatabase, TableDataSource } from '../../../utilities';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { AppointmentService } from '../appointment.service';
import { FormControl } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';

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
  selector: 'app-appointment-slots',
  templateUrl: './appointment-slots.component.html',
  styleUrls: ['./appointment-slots.component.css']
})
export class AppointmentSlotsComponent implements OnInit {

  categories: Array<ApptCat> = [];
  category: ApptCat;

  selected: Appointment;

  entlist: Appointment[];
  aps: Array<Appointment> = [];

  dailyAppts: Array<DailyData> = [];

  searchTerm: FormControl = new FormControl();

  currentFilter = '';
  displayedColumns = ['name', 'start_time', 'category', 'actions'];

  tableDatabase = new TableDatabase();
  dataSource: TableDataSource | null;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


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
  duration: number;

  constructor(private service: AppointmentService, private calendar: NgbCalendar,
    private router: Router, private route: ActivatedRoute,
    public dialog: MatDialog) {

    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

    // this.date1 = new FormControl(calendar.getToday());
    // this.date2 = new FormControl(calendar.getNext(calendar.getToday(), 'd', 10));
  }

  ngOnInit() {

    this.duration = 15;

    this.service.get_categories().then(response => {
      response.forEach((doc) => {
        console.log(doc.id + ' : ' + doc.get('name'));
        const a = new ApptCat(doc.id, doc.get('name'));
        this.categories.push(a);
      });
      this.category = this.categories[0];

      this.filter();
      this.dataSource = new TableDataSource(this.tableDatabase, this.sort);
    });

    let d = this.route.snapshot.queryParamMap.get('d1');
    console.log('firstParam ' + d);
    if (d !== null) {
      this.date1 = new FormControl(new Date(d));
    } else {
      this.date1 = new FormControl(new Date());
    }

    d = this.route.snapshot.queryParamMap.get('d2');
    if (d !== null) {
      this.date2 = new FormControl(new Date(d));
    } else {
      const d2: Date = new Date();
      d2.setDate(new Date().getDate() + 3);
      this.date2 = new FormControl(d2);
    }


  }

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  onDateSelection(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    this.service.getFreeAppointmentsPerDay(d, this.category).then(response => {
      this.aps  = [];
      this.tableDatabase.clear();
      response.forEach((doc) => {

        const a: Appointment = this.service.getApptFromToken(doc);

        this.aps.push(a);
        this.tableDatabase.addLine(a);
        // console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
      });
    });
  }

  onDateNavigation(event: NgbDatepickerNavigateEvent) {
    // console.log(event.current.month + '   ' + event.next.month );
    this.date = event.next;
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



  //   const params = new HttpParams()
  // .set('page', '2')
  // .set('sort', '32');

    const q = {
      ID: 'id',
      d1 : d1.toISOString(),
      d2 : d2.toISOString(),
      category: this.category.id
    };

    this.router.navigate(['/consulate/app-slots'], {queryParams: q});

    this.service.search_firestore(this.searchTerm.value, d1, d2, this.category).then(response => {
      this.aps  = [];
      this.tableDatabase.clear();
      response.forEach((doc) => {
        const a: Appointment = this.service.getApptFromToken(doc);

        // console.log(a.start_time.getDate() + '..' + a.start_time.getMonth());

        const res = this.dailyAppts.filter(
          dd => dd.day === a.start_time.getDate() && dd.month === a.start_time.getMonth() + 1);
        if (res.length === 0) {
          this.dailyAppts.push(new DailyData(a.start_time.getDate(), a.start_time.getMonth() + 1, 1));
        } else {
          res[0].freeAppointments++;
        }


        this.aps.push(a);
        this.tableDatabase.addLine(a);

        // console.log(doc.get('body'));
        // console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
      });
    });
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate) && !this.isWeekend(date);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);
  isFull = date => {
    // console.log(date.day + '/' + date.month + '..' + this.dailyAppts.length +
    // '...' + this.dailyAppts[0].day + '/' + this.dailyAppts[0].month);
    const res = this.dailyAppts.filter(
      dd => dd.day === date.day && dd.month === date.month);
      if (res.length > 0
        // && res[0].freeAppointments > 0
        ) {
        return true;
      } else {
        return false;
      }
  }


  openDialog(): void {
    console.log('openDialog ');
    // const d1: Date = this.date1.value;
    // d1.setHours(this.fromTime.hour);
    // d1.setMinutes(this.fromTime.minute);
    // d1.setSeconds(0);
    // const d2: Date = this.date2.value;
    // d2.setHours(this.toTime.hour);
    // d2.setMinutes(this.toTime.minute);
    // d2.setSeconds(0);
    const dialogRef = this.dialog.open(AppointmentSlotDialogComponent, {
      width: '400px',
      data: {
        fromDate: this.date1.value,
        toDate: this.date2.value,
        fromTime: this.fromTime,
        toTime: this.toTime,
        appointmentDuration: this.duration,
        category: this.category
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}


@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: './dialog.html',
})
export class AppointmentSlotDialogComponent {

  workdays: number;

  workday_count(start: Date, end: Date) {
    let numWorkDays = 0;
    const currentDate = new Date(start);
    while (currentDate <= end) {
        // Skips Sunday and Saturday
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            numWorkDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return numWorkDays;
  }

  constructor(
    public dialogRef: MatDialogRef<AppointmentSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreationData,
    private service: AppointmentService
  ) {

      const now1 = moment().format('LLLL');

      console.log(now1 + ' here goes the process of creation data..' + data.appointmentDuration);

      this.workdays = this. workday_count(data.fromDate, data.toDate);



    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {

    this.service.createAppointments(this.data);

  }

}
