import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../security/users/user';
import { HttpClient } from '@angular/common/http';

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

  autocompleteUrl = 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json?' +
  'app_id=K0Z4rKzWnBk4eR25vS40&app_code=OEBSCrinYftL-OQPodOiOw' +
  '&query=';

  locationIdUrl = 'http://geocoder.api.here.com/6.2/geocode.json' +
  '?jsonattributes=1' +
  '&gen=9' +
  '&app_id=' + this.APP_ID +
  '&app_code=' + this.APP_CODE +
  '&locationid=';

  constructor(private http: HttpClient) {
  }

  search(keyword: string): Observable<any[]> {
    const req = this.autocompleteUrl + keyword + '&beginHighlight=<b>&endHighlight=</b>';
    return this.http.get<any>(req);
   }



}
