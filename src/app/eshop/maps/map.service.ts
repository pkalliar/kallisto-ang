import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  geocoder: any;

  url = 'https://geocoder.api.here.com/6.2/geocode.json?app_id='
  + '{K0Z4rKzWnBk4eR25vS40}&app_code={OEBSCrinYftL-OQPodOiOw}&searchtext=425+W+Randolph+Chicago';

  constructor() {
    const platform = new H.service.Platform({
      app_id: 'K0Z4rKzWnBk4eR25vS40',
      app_code: 'OEBSCrinYftL-OQPodOiOw'
    });


        // Get an instance of the geocoding service:
        this.geocoder = platform.getGeocodingService();
  }

  search(filter: {name: string} = {name: ''}, page = 1): Observable<IUserResponse> {
    return this.http.get<IUserResponse>('/api/users')
    .pipe(
      tap((response: IUserResponse) => {
        response.results = response.results
          .map(user => new User(user.id, user.name))
          // Not filtering in the server since in-memory-web-api has somewhat restricted api
          .filter(user => user.name.includes(filter.name))

        return response;
      })
      );
  }

}
