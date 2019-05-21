import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapService, NavtexData } from '../map.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

export class NavtexDetails {
  name: string;
  points: number[];

  constructor(name, points) {
      this.name = name;
      this.points = points;
  }
}

@Component({
  selector: 'pk-navtex-detail',
  templateUrl: './navtex-detail.component.html',
  styleUrls: ['./navtex-detail.component.css']
})
export class NavtexDetailComponent implements OnInit {

  selectedStation: string;
  stations: string[];
  navtexData: NavtexData = null;

  @Output() positioned = new EventEmitter<Object>();


  searchNavtex: FormControl = new FormControl();
  searchFullNavtex: FormControl = new FormControl();


  constructor(private mapSrv: MapService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.stations = this.mapSrv.stations;
    this.selectedStation = this.stations[0];

    this.searchNavtex.valueChanges
    .pipe(
      debounceTime(300),
      tap(() => {}),
      switchMap(value => this.mapSrv.searchFullNavtex(value)
      .pipe()
      )
    )
    .subscribe(data => {
      console.log(data);
      // this.points = data;
      // this.positioned.emit(this.points);
    });

    this.searchFullNavtex.valueChanges
    .pipe(
      debounceTime(300),
      tap(() => {}),
      switchMap(value => this.mapSrv.searchFullNavtex(value)
      .pipe()
      )
    )
    .subscribe(data => {
      console.log(data);
      this.navtexData = data;
      this.positioned.emit(this.navtexData);
    });

  }



}
