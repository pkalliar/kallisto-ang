import { Component, OnInit, ViewChild } from '@angular/core';
import { Appointment } from '../appointment';
import { TableDatabase, TableDataSource } from '../../../utilities';
import { MatSort } from '@angular/material';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  selected: Appointment;

  entlist: Appointment[];

  currentFilter = '';
  displayedColumns = ['name', 'start_time', 'end_time'];

  tableDatabase = new TableDatabase();
  dataSource: TableDataSource | null;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private service: AppointmentService) { }

  ngOnInit() {
  }

}
