import { Injectable, Component, Inject } from '@angular/core';
import {Observable, of as observableOf} from 'rxjs';
import { User } from '../../security/users/user';
import { HttpClient } from '@angular/common/http';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MapLayer } from './map/map.component';
import { AngularFirestore } from 'angularfire2/firestore';

export interface DialogData {
  type: number;
  data: any;
}

export class NavtexData {
  station: string;
  name: string;
  points: any[];

  constructor() {
    this.points = [];
  }
}

declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  NAVTEX_DETAIL = 1;
  NAVTEX_LIST = 2;
  LAYER_LIST = 3;

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

  constructor(private http: HttpClient, private afs: AngularFirestore) {
  }

  search(keyword: string): Observable<any[]> {
    const req = this.autocompleteUrl + keyword + '&beginHighlight=<b>&endHighlight=</b>';
    return this.http.get<any>(req);
   }

   searchNavtex(keyword: string, selectedStation: string): any[] {
    console.log('searching for navtex ' + keyword);
    const splitted = keyword.split('E');
    const points = [];
    try {
      // throw new Error('Something bad happened');
      splitted.forEach((doc) => {
        console.log(doc);
        if (doc.trim().length > 0) {
          const point = this.parseCoordLine(doc);
          // const point1 = new H.geo.Point(point['lat'], point['lng']);
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

    // this.saveNavtex(points);

    return points;
   }

   parseCoordLine(line: string) {
    const coord = line.replace('E', '').trim().split('N');
    const lat = coord[0].replace('-', '').trim(), long = coord[1].replace('-', '').trim();
    const point = {};
    console.log(lat + '____' + long);
    const latArr = lat.trim().split(' ');
    if (latArr.length === 2) {
      const lat1 = parseInt(latArr[0], 10);
      const lat2 = parseFloat(latArr[1]) / 60;
      point['lat'] = lat1 + lat2;
    } else if (latArr.length === 3) {
      const lat1 = parseInt(latArr[0], 10);
      const lat2 = parseInt(latArr[1], 10) / 100;
      const lat3 = parseInt(latArr[2], 10) / 10000;
      point['lat'] = lat1 + lat2 + lat3;
    }
    const longArr = long.trim().split(' ');
    console.log(longArr);
    if (longArr.length === 2) {
      const long1 = parseInt(longArr[0], 10);
      const long2 = parseFloat(longArr[1]) / 60;
      point['lng'] = long1 + long2;
    } else if (longArr.length === 3) {
      const long1 = parseInt(longArr[0], 10);
      const long2 = parseInt(longArr[1], 10) / 100;
      const long3 = parseInt(longArr[2], 10) / 10000;
      point['lng'] = long1 + long2 + long3;
    }
    return point;
   }


   searchFullNavtex(navtex: string): Observable<any> {
    // let selectedStation = '';
    // let points = [];
    const resp: NavtexData = new NavtexData();

    console.log(navtex);

    const arrayOfLines = navtex.match(/[^\r\n]+/g);
    arrayOfLines.forEach((line) => {
      console.log(line);
      if (resp.station === undefined) {
        if (line.includes('Antalya') && line.includes('TURNHOS')) {
          resp.station = this.stations[0];
        } else if (line.includes('JRCC LARNACA')) {
          resp.station = this.stations[1];
        }
      } else if (resp.station === this.stations[0]) {
          if (line.includes('TURNHOS N/W') && line.includes(':')) {
            resp.name = line.split(':')[1].trim();
          } else if (line.startsWith('3') && line.includes(' N') && line.includes(' E')) {
            const point = this.parseCoordLine(line);
            // const point1 = new H.geo.Point(point['lat'], point['lng']);
            resp.points.push(point);
          }
      } else if (resp.station === this.stations[1]) {
        if (line.includes('NAV WRNG NR')) {
          resp.name = line.split('NR')[1].trim();
        } else if (line.startsWith('3') && line.includes(' N') && line.includes(' E')) {
          const point = this.parseCoordLine(line);
          // const point1 = new H.geo.Point(point['lat'], point['lng']);
          resp.points.push(point);
        }
      }


    });
    if (resp.points.length > 0) {
      resp.points.push(resp.points[0]);
    }

    // points = this.searchNavtex(navtex, selectedStation);

    return observableOf(resp);
   }

   getCoordinates(locationId) {
    const req = this.locationIdUrl + locationId;
    return this.http.get<any>(req);
   }

   saveNavtex(navtexData) {

      // this.afs.collection('navtex').doc(navtexData.name).set(Object.assign({}, navtexData));
      this.afs.collection('navtex').add(Object.assign({}, navtexData))
      .then(doc => {
        console.log('Document successfully written!');

      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });

      // localStorage.setItem('test1', JSON.stringify(points));
   }

   searchNavtexDB(keyword) {
    console.log('in searchNavtex..');
    return this.afs.firestore.collection('navtex').get().then(querySnapshot => querySnapshot.docs);
   }

   getFromToken(token): NavtexData {

    const nvtx = new NavtexData();

    nvtx.name = token.get('name');
    nvtx.station = token.get('station');
    nvtx.points = token.get('points');
    return nvtx;
  }



}

