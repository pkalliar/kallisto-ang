import { Component, OnInit, ViewChild } from '@angular/core';
import { Appointment } from '../appointment';
import { TableDatabase, TableDataSource } from '../../../utilities';
import { MatSort } from '@angular/material';
import { AppointmentService } from '../appointment.service';
import { FormControl } from '@angular/forms';

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


  constructor(private service: AppointmentService) { }

  ngOnInit() {
    this.service.search_firestore(this.searchTerm.value).then(response => {
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
    this.dataSource = new TableDataSource(this.tableDatabase, this.sort);
  }

}
