import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MapService } from '../map.service';
import { NavtexData, NavtexStation } from '../navtex-data';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap } from 'rxjs/operators';
import {Observable, of as observableOf} from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pk-navtex-list',
  templateUrl: './navtex-list.component.html',
  styleUrls: ['./navtex-list.component.css']
})
export class NavtexListComponent implements OnInit {

  @Input() nvtxs: NavtexData[] = [];
  @Input() stations: NavtexStation[];




  @Output() navtexSelected = new EventEmitter<Object>();
  @Output() closePressed = new EventEmitter<Object>();
  @Output() focusSelected = new EventEmitter<Object>();
  @Output() detailSelected = new EventEmitter<Object>();

  showStations = false;

  searchText = '';

  constructor(private mapSrv: MapService) { }

  @Input() testFunction(stations) {
    console.log(stations);
    this.updateNvtxList(stations);
  }

  ngOnInit() {

    // this.stations = this.mapSrv.stations;

    // this.stations.map(station => {
    //   if (station.name === 'Antalya NAVTEX Station') {
    //     station.show = true;
    //   }
    //   return station;
    // }
    // );

    if (this.nvtxs.length  === 0) {
      this.mapSrv.searchNavtexDB('', ['69jbegve7sX9gb7qoYGr', 'aPzcqwfpOHuYn8ebeP68'])
        .then(response => {
          response.forEach((doc) => {
            const nvtx = this.mapSrv.getFromToken(doc);
            this.nvtxs.push(nvtx);
            // console.log(doc.get('name'));
            // console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
          });
      });
    }

    // console.log(this.stations);

  }

  updateNvtxList(stations: string[]) {
    if (stations.length > 0) {
      this.mapSrv.searchNavtexDB('', stations)
      .then(response => {
        this.nvtxs = [];
        response.forEach((doc) => {
          const nvtx = this.mapSrv.getFromToken(doc);
          this.nvtxs.push(nvtx);
          // console.log(doc.get('name'));
          // console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
        });
      });
    } else {
      this.nvtxs = [];
    }

  }

  filterNvtx(value): Observable<any> {
    console.log('filtering value ' + value);

    return observableOf(value);
  }

  onVisibilityClick(nv: NavtexData) {
    nv.show = !nv.show;
    this.navtexSelected.emit(nv);
    // sessionStorage.setItem('user', this.nvtxs[i]);
    // this.nvtxs.forEach(function(nvtx) {
    //   if (nvtx.name === e.option.value.name) {
    //     nvtx.show = e.option.selected;
    //   }
    //   console.log(nvtx.name);
    // });
  }

  onFocusClick(nv: NavtexData) {
    this.focusSelected.emit(nv);
  }

  onNvtxDetailClick(nv: NavtexData) {
    this.detailSelected.emit(nv);
  }

  onNvtxDetailDelete(nv: NavtexData) {
    console.log(nv);
    this.mapSrv.deleteNavtex(nv.id);
  }

}
