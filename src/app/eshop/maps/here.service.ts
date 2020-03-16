import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class HereService {

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

  platform: any;

  constructor(private http: HttpClient) {
    this.platform = new H.service.Platform({ apikey: environment.hereCredentials.apikey });
  }

  search(keyword: string): Observable<any[]> {
    const req = this.autocompleteUrl + keyword + '&beginHighlight=<b>&endHighlight=</b>';
    return this.http.get<any>(req);
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

  getCoordinates(locationId) {
    const req = this.locationIdUrl + locationId;
    return this.http.get<any>(req);
  }

}
