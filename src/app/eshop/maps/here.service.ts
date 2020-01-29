import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

declare var H: any;

@Injectable({
  providedIn: 'root'
})
export class HereService {

  platform: any;

  constructor() { 
    this.platform = new H.service.Platform({ apikey: environment.hereCredentials.apikey });
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
