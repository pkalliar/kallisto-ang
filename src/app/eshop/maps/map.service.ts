import { Injectable, Component, Inject } from '@angular/core';
import {Observable, of as observableOf} from 'rxjs';
import { User } from '../../security/users/user';
import { HttpClient } from '@angular/common/http';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MapLayer } from './map/map.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  APP_ID = 'K0Z4rKzWnBk4eR25vS40';
  APP_CODE = 'OEBSCrinYftL-OQPodOiOw';

  geocoder: any;

  baseUrl = 'https://geocoder.api.here.com/6.2/geocode.json?' +
  'app_id=K0Z4rKzWnBk4eR25vS40&app_code=OEBSCrinYftL-OQPodOiOw' +
  '&searchtext=425+W+Randolph+Chicago';

  autocompleteUrl = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json?' +
  'app_id=K0Z4rKzWnBk4eR25vS40&app_code=OEBSCrinYftL-OQPodOiOw' +
  '&query=';

  locationIdUrl = 'https://geocoder.api.here.com/6.2/geocode.json' +
  '?jsonattributes=1' +
  '&gen=9' +
  '&app_id=' + this.APP_ID +
  '&app_code=' + this.APP_CODE +
  '&locationid=';

  stations: string[] = ['ANTALYA NAVTEX STATION', 'JRCC LARNACA'];

  constructor(private http: HttpClient) {
  }

  search(keyword: string): Observable<any[]> {
    const req = this.autocompleteUrl + keyword + '&beginHighlight=<b>&endHighlight=</b>';
    return this.http.get<any>(req);
   }

   searchNavtex(keyword: string): Observable<any[]> {
    console.log('searching for navtex ' + keyword);
    const splitted = keyword.split('E');
    const points = [];
    try {
      // throw new Error('Something bad happened');
      splitted.forEach((doc) => {
        console.log(doc);
        if (doc.trim().length > 0) {
          const coord = doc.trim().split('-');
          const lat = coord[0].replace('N', '').trim(), long = coord[1].trim();
          const point = {};
          const latArr = lat.trim().split(' ');
          if (latArr.length === 2) {
            const lat1 = parseInt(latArr[0], 10);
            const lat2 = parseFloat(latArr[1]) / 60;
            point['lat'] = lat1 + lat2;
          }
          const longArr = long.trim().split(' ');
          if (longArr.length === 2) {
            const long1 = parseInt(longArr[0], 10);
            const long2 = parseFloat(longArr[1]) / 60;
            point['lng'] = long1 + long2;
          }
          points.push(point);
        }
      });
      if (points.length > 0) {
        points.push(points[0]);
      }

    } catch (e) {
      console.log(e);
    }


    console.log(points);

    return observableOf(points);
   }

   getCoordinates(locationId) {
    const req = this.locationIdUrl + locationId;
    return this.http.get<any>(req);
   }



}

@Component({
  selector: 'app-map-dialog',
  templateUrl: 'map-dialog.html',
})
export class MapDialogComponent {

  mapLayers: MapLayer[] = [];
  // @ViewChild(MatSelectionList) selectionList: MatSelectionList;

  constructor(
    public dialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapLayer[]) {
      this.mapLayers = data;

      console.log();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSelection(e, v) {
    console.log(e.option.value);
    console.log(e.option.selected);

    this.mapLayers.forEach(function(layer) {
      if (layer.name === e.option.value.name) {
        layer.show = e.option.selected;
      }
      console.log(layer.name);
    });


    console.log(v.selected);
    // v.selected.forEach(function(layer) {
    //   console.log(layer.value);
    // });

 }

}
