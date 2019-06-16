import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapService } from '../map.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { NavtexData } from '../navtex-data';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pk-navtex-detail',
  templateUrl: './navtex-detail.component.html',
  styleUrls: ['./navtex-detail.component.css']
})
export class NavtexDetailComponent implements OnInit {

  selectedStation: string;
  stations: string[];
  @Input() navtexData: NavtexData =  new NavtexData();

  // @Input() nvtx: NavtexData;

  @Output() positioned = new EventEmitter<Object>();
  @Output() closePressed = new EventEmitter<Object>();

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

  save() {
    console.log('saving');
    this.mapSrv.saveNavtex(this.navtexData).then(doc => {
        console.log('Document successfully written! ' + doc.id);
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });
  }

  clear() {
    this.navtexData =  new NavtexData();
  }

}
