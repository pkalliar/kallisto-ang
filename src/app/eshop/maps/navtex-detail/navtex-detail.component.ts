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
  description = '';
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
      this.positioned.emit(this.navtexData);
    });

  }

  save() {
    console.log('saving ' + JSON.stringify(this.navtexData));
    this.mapSrv.saveNavtex(this.navtexData).then(doc => {
        alert('Document successfully written! ' + doc.id);
        
      })
      .catch(function(error) {
        alert('Error writing document: ' + error);
      });
  }

  clear() {
    this.navtexData =  new NavtexData();
  }

}
