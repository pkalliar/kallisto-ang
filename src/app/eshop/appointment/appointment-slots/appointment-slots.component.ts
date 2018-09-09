import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { Appointment, ApptCat } from '../appointment';
import { TableDatabase, TableDataSource } from '../../../utilities';
import { MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppointmentService } from '../appointment.service';
import { FormControl } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

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

  searchTerm: FormControl = new FormControl();

  currentFilter = '';
  displayedColumns = ['name', 'start_time', 'category', 'actions'];

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

  constructor(private service: AppointmentService, calendar: NgbCalendar,
    private router: Router, private route: ActivatedRoute,
    public dialog: MatDialog) {

    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);





    // this.date1 = new FormControl(calendar.getToday());
    // this.date2 = new FormControl(calendar.getNext(calendar.getToday(), 'd', 10));
  }

  ngOnInit() {

    this.service.get_categories().then(response => {
      response.forEach((doc) => {
        console.log(doc.id + ' : ' + doc.get('name'));
        const a = new ApptCat(doc.id, doc.get('name'));
        this.categories.push(a);
      });
      this.category = this.categories[0];
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
      d2.setDate(new Date().getDate() + 10);
      this.date2 = new FormControl(d2);
    }


    // this.filter();
    this.dataSource = new TableDataSource(this.tableDatabase, this.sort);



  }

  selectToday() {
    this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  onDateSelection(date: NgbDateStruct) {
    console.log('selected ' + JSON.stringify(this.model));
    // if (!this.fromDate && !this.toDate) {
    //   this.fromDate = date;
    // } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
    //   this.toDate = date;
    // } else {
    //   this.toDate = null;
    //   this.fromDate = date;
    // }
  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month || this.isWeekend(date);
  }

  openDialog(): void {
    console.log('openDialog ');
    const dialogRef = this.dialog.open(DialogAppointmentSlotDialog, {
      width: '250px',
      data: {name: 'this.name', animal: 'this.animal'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
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


    this.service.search_firestore(this.searchTerm.value, d1, d2).then(response => {
      this.aps  = [];
      this.tableDatabase.clear();
      response.forEach((doc) => {

        const a: Appointment = this.service.getApptFromToken(doc);


        this.aps.push(a);
        this.tableDatabase.addLine(a);

        console.log(doc.get('body'));
            console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
      });
    });
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate) && !this.isWeekend(date);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);



}

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
})
export class DialogAppointmentSlotDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogAppointmentSlotDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
