import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchCultureService {

  API = '51b14e1f-2382-48f9-afcf-294717a5e3b8';

  constructor(private http: HttpClient) { }

  search(filter: {name: string} = {name: ''}, page = 1): Observable<any> {
    return this.http.get<any>('/api/users')
    .pipe(
      tap((response: any) => {
        response.results = response.results
          .map(res => res)
          // Not filtering in the server since in-memory-web-api has somewhat restricted api
          .filter(res => res.length > 0);

        return response;
      })
      );
  }
}
