import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MapService } from '../map.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { NavtexData, NavtexStation } from '../navtex-data';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pk-navtex-detail',
  templateUrl: './navtex-detail.component.html',
  styleUrls: ['./navtex-detail.component.css']
})
export class NavtexDetailComponent implements OnInit {

  selectedStation: NavtexStation;
  stations: NavtexStation[];
  description = '';
  selectedTab = 1;
  @Input() navtexData: NavtexData =  new NavtexData();

  // @Input() nvtx: NavtexData;

  @Output() positioned = new EventEmitter<Object>();
  @Output() closePressed = new EventEmitter<Object>();
  @Output() saved = new EventEmitter<Object>();
  @Output() previewed = new EventEmitter<Object>();
  @Output() cleared = new EventEmitter<Object>();

  searchNavtex: FormControl = new FormControl();
  searchFullNavtex: FormControl = new FormControl();


  constructor(private mapSrv: MapService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.stations = this.mapSrv.stations;
    this.selectedStation = this.stations[0];

    if (this.navtexData !== null) {
      this.description = this.navtexData.description;
    }


    // this.searchNavtex.valueChanges
    // .pipe(
    //   debounceTime(300),
    //   tap(() => {}),
    //   switchMap(value => this.mapSrv.searchFullNavtex(value)
    //   .pipe()
    //   )
    // )
    // .subscribe(data => {
    //   console.log(data);
    // });

    this.searchFullNavtex.valueChanges
    .pipe(
      debounceTime(300),
      tap(() => {}),
      switchMap(value => this.mapSrv.searchFullNavtex(value, this.navtexData)
      .pipe()
      )
    )
    .subscribe(data => {
      console.log(data);
      this.navtexData = data;
      this.description = this.navtexData.description;
      this.selectedTab = 0;
      this.positioned.emit(this.navtexData);
    });

  }

  save() {
    console.log('saving ');
    this.navtexData.station_id = this.mapSrv.getNavtexStationId(this.navtexData.station_name);
    console.log(this.navtexData);
    this.mapSrv.saveNavtex(this.navtexData).then(doc => {
        alert('Document successfully written! ' + doc.id);

      })
      .catch(function(error) {
        alert('Error writing document: ' + error);
      });
  }

  preview() {
    console.log('previewing ' + JSON.stringify(this.navtexData));
    this.previewed.emit(this.navtexData);
  }

  clear() {
    this.navtexData =  null; // new NavtexData();
    this.cleared.emit(this.navtexData);
  }

}
