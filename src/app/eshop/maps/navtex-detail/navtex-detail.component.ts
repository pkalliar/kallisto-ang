import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapService } from '../map.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'pk-navtex-detail',
  templateUrl: './navtex-detail.component.html',
  styleUrls: ['./navtex-detail.component.css']
})
export class NavtexDetailComponent implements OnInit {

  selectedStation: string;
  stations: string[];
  points = [];

  @Output() positioned = new EventEmitter<Object>();


  searchNavtex: FormControl = new FormControl();


  constructor(private mapSrv: MapService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.stations = this.mapSrv.stations;
    this.selectedStation = this.stations[0];

    this.searchNavtex.valueChanges
    .pipe(
      debounceTime(300),
      tap(() => {}),
      switchMap(value => this.mapSrv.searchNavtex(value, this.selectedStation)
      .pipe()
      )
    )
    .subscribe(data => {
      console.log(data);
      this.points = data;


      this.positioned.emit(this.points);

    });

  }



}
