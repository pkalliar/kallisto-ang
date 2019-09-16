import { Injectable, Component, Inject } from '@angular/core';
import {Observable, of as observableOf} from 'rxjs';
import { User } from '../../security/users/user';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapLayer } from './map/map.component';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import * as moment from 'moment';
import { NavtexData, Geoshape } from './navtex-data';

declare var google: any;

export interface DialogData {
  type: number;
  data: any;
}



declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  NAVTEX_DETAIL = 1;
  NAVTEX_LIST = 2;
  LAYER_LIST = 3;

  geocoder: any;
  platform: any;

  baseUrl = 'https://geocoder.api.here.com/6.2/geocode.json?' +
  'app_id=' + environment.heremaps.appId +
  '&app_code=' + environment.heremaps.appCode +
  '&searchtext=425+W+Randolph+Chicago';

  autocompleteUrl = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json?' +
  'app_id=' + environment.heremaps.appId +
  '&app_code=' + environment.heremaps.appCode +
  '&query=';

  locationIdUrl = 'https://geocoder.api.here.com/6.2/geocode.json' +
  '?jsonattributes=1' +
  '&gen=9' +
  '&app_id=' + environment.heremaps.appId +
  '&app_code=' + environment.heremaps.appCode +
  '&locationid=';

  stations: string[] = ['ANTALYA STATION', 'JRCC LARNACA', 'IZMIR STATION', 'SAMSUN STATION'];

  shapes: string[] = ['polygon', 'circle', 'points'];

  constructor(private http: HttpClient, private afs: AngularFirestore) {
    this.platform = new H.service.Platform({
      app_id: environment.heremaps.appId,
      app_code: environment.heremaps.appCode,
      useHTTPS: true
    });
  }

  search(keyword: string): Observable<any[]> {
    const req = this.autocompleteUrl + keyword + '&beginHighlight=<b>&endHighlight=</b>';
    return this.http.get<any>(req);
   }

   getArea(navtexData: NavtexData) {
     let totalArea = 0;
      // console.log(navtexData.points);
      navtexData.geoshapes.forEach( shape => {
        const paths = [];
        shape.points.forEach(function(point) {
          paths.push(new google.maps.LatLng(point.lat, point.lng));
        });
        const area = google.maps.geometry.spherical.computeArea(paths);
        totalArea = totalArea + area;
        console.log('polygon area=' + area.toFixed(2) / 1000000 + ' sq kilometers');
      }
      );
      return totalArea;
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
    const coord = line.replace('E', '').replace('(SHORE)', '').replace('/°/g', '').replace(/'/g, '').trim().split('N');
    const lat = coord[0].replace('-', '').trim(), long = coord[1].replace('-', '').trim();
    const point = {};
    console.log(lat + '____' + long);
    const latArr = lat.trim().split(' ');
    console.log(latArr);
    if (latArr.length === 2) {
      const lat1 = parseInt(latArr[0], 10);
      const lat2 = parseFloat(latArr[1]) / 60;
      point['lat'] = lat1 + lat2;
    } else if (latArr.length === 3) {
      const lat1 = parseInt(latArr[0], 10);
      const lat2 = parseInt(latArr[1], 10) / 60;
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
      const long2 = parseInt(longArr[1], 10) / 60;
      const long3 = parseInt(longArr[2], 10) / 10000;
      point['lng'] = long1 + long2 + long3;
    }
    return point;
   }


   searchFullNavtex(navtex: string, currNavObj: NavtexData): Observable<NavtexData> {
    // let selectedStation = '';
    // let points = [];
    // const resp: NavtexData = new NavtexData();
    let resp: NavtexData = currNavObj;

    console.log(navtex);
    if (navtex === undefined || navtex.length === 0) {
      return observableOf(resp);
    }
    if (currNavObj === null ) {
      resp = new NavtexData();
    } else {
      resp.geoshapes = [];
    }
    resp.description = navtex;

    let points = [];
    let currentLine = 0;
    let coordline = 0;

    const arrayOfLines = navtex.match(/[^\r\n]+/g);
    arrayOfLines.forEach((line) => {
      currentLine++;
      console.log(currentLine + '__' + line);
      if (resp.station === undefined) {
        if (line.includes('Antalya') && line.includes('TURNHOS')) {
          resp.station = this.stations[0];
        } else if (line.includes('JRCC LARNACA')) {
          resp.station = this.stations[1];
        } else if (line.includes('İzmir NAVTEX Station')) {
          resp.station = this.stations[2];
        } else if (line.includes('Samsun') && line.includes('TURNHOS')) {
          resp.station = this.stations[3];
        }
        if (line.includes('Published Date')) {
          const n = line.indexOf('Published Date');
          const publStr = line.substr(n + 16, 10);
          const publDate = moment(publStr, 'DD-MM-YYYY').toDate();
          console.log('publStr ' + publStr + ' ' + publDate);
          resp.published = publDate;
        }
        if (line.includes('UTC')) {
          // const tokens = line.split(' ');
          const publDate = moment(line, 'DD HHmm UTC MMM YYYY').toDate();
          console.log('publStr ' + line + ' ' + publDate);
          resp.published = publDate;

        }
      } else if (resp.station === this.stations[0] || resp.station === this.stations[2] || resp.station === this.stations[3]) {
          if (line.includes('TURNHOS N/W') && line.includes(':')) {
            resp.name = line.split(':')[1].trim();
          } else if ((line.startsWith('2') || line.startsWith('3'))
          && line.includes(' N')
          && line.includes(' E')) {
            const point = this.parseCoordLine(line);

            // const point1 = new H.geo.Point(point['lat'], point['lng']);
            // resp.points.push(point);

            if (currentLine - coordline > 1) {
              if (points.length > 0) {
                // points.push(points[0]);
                resp.geoshapes.push( new Geoshape(this.shapes[0], points));
                points = new Array();
              }
            }
            points.push(point);
            coordline = currentLine;
          }
      } else if (resp.station === this.stations[1]) {
        if (line.includes('NAV WRNG NR')) {
          resp.name = line.split('NR')[1].trim();
        } else if ((line.startsWith('2') || line.startsWith('3'))
        && (line.includes(' N') || line.includes(' \'N') || line.includes('N') )
        && (line.includes(' E') || line.includes(' \'E') || line.includes('E'))) {
          const point = this.parseCoordLine(line);
          // const point1 = new H.geo.Point(point['lat'], point['lng']);
          // resp.points.push(point);

          if (currentLine - coordline > 1) {
            if (points.length > 0) {
              // points.push(points[0]);
              resp.geoshapes.push( new Geoshape(this.shapes[0], points));
              points = new Array();
            }
          }
          points.push(point);
          coordline = currentLine;
        }
      }


    });
    // if (resp.points.length > 0) {
    //   resp.points.push(resp.points[0]);
    // }
    // if (points.length > 0) {
    //   points.push(points[0]);
    // }
    resp.geoshapes.push( new Geoshape(this.shapes[0], points));

    this.getArea(resp);

    // points = this.searchNavtex(navtex, selectedStation);

    return observableOf(resp);
   }

   getCoordinates(locationId) {
    const req = this.locationIdUrl + locationId;
    return this.http.get<any>(req);
   }

   saveNavtex(navtexData: NavtexData): Promise<DocumentReference> {
      // this.afs.collection('navtex').doc(navtexData.name).set(Object.assign({}, navtexData));
      const gshapes = [];

      navtexData.geoshapes.forEach(sh => {
        gshapes.push(
          {
            type: sh.type,
            points: sh.points
          }
        );
      });

      const toSave = {
        name: navtexData.name,
        station: navtexData.station,
        created_on: new Date(),
        description: navtexData.description,
        published: navtexData.published,
        valid_from: navtexData.valid_from,
        valid_until: navtexData.valid_until,
        geoshapes: gshapes
        // geoshapes: navtexData.geoshapes
      };

      // if (navtexData.valid_from) {
      //   toSave['valid_from'] = navtexData.valid_from;
      // }
      // if (navtexData.valid_until) {
      //   toSave['valid_until'] = navtexData.valid_until;
      // }

      console.log(toSave);
      return this.afs.collection('navtex').add(Object.assign({}, toSave));
      // .then(doc => {
      //   console.log('Document successfully written!');

      // })
      // .catch(function(error) {
      //   console.error('Error writing document: ', error);
      // });

      // localStorage.setItem('test1', JSON.stringify(points));
   }

   searchNavtexDB(keyword) {
    console.log('in searchNavtex..');
    return this.afs.firestore.collection('navtex')
    .orderBy('published', 'desc')
    .get().then(querySnapshot => querySnapshot.docs);
   }

   deleteNavtex(id) {
    return this.afs.collection('navtex').doc(id).delete();
   }

   getFromToken(token): NavtexData {

    const nvtx = new NavtexData();
    nvtx.id = token.id;
    nvtx.name = token.get('name');
    nvtx.description = token.get('description');
    nvtx.created_on = new Date((token.get('created_on').seconds * 1000));
    nvtx.published = new Date((token.get('published').seconds * 1000));
    nvtx.valid_from = new Date((token.get('valid_from').seconds * 1000));
    nvtx.valid_until = new Date((token.get('valid_until').seconds * 1000));
    nvtx.station = token.get('station');
    // nvtx.points = token.get('points');
    nvtx.geoshapes = token.get('geoshapes');
    return nvtx;
  }

  calculateRouteFromAtoB (from, to) {
    const router = this.platform.getRoutingService(),
      routeRequestParams = {
        mode: 'shortest;pedestrian',
        representation: 'display',
        waypoint0: from.lat + ',' + from.lng, // St Paul's Cathedral
        waypoint1: to.lat + ',' + to.lng,  // Tate Modern
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action'
      };
    router.calculateRoute(
      routeRequestParams,
      result => {
        const route = result.response.route[0];
        console.log(route);
       },
      error => {}
    );
  }



}

