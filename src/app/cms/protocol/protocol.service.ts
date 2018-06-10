import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import { Protocol } from './protocol';
import {environment} from '../../../environments/environment';

@Injectable()
export class ProtocolService {

    private baseUrl = environment.apiurl + '/apiV2/protocols';  // URL to web api
    url: string;
    constructor(private http: Http, private httpClient: HttpClient) {
      this.url  = '';

    }

    search_word(term) {
      return this.http.get(this.baseUrl + '/search/' + term).map(res => {
          return res.json().map(item => {
              return item;
          });
      });
  }


  getOne(id: string): Promise<Protocol> {
      // return this.getContacts()
      //      .then(contacts => contacts.find(contact => contact.id === id));
      return this.http.get(this.baseUrl + '/' + id)
           .toPromise()
           .then(response => response.json())
           .catch(this.handleError);
  }

  get(filter: any): Promise<Protocol[]> {
   return this.http.get(this.baseUrl + '/filter/' + filter)
              .toPromise()
              .then(response => response.json() as Protocol[])
              .catch(this.handleError);
  }

  search(keyword: string): Promise<Protocol[]> {
    return this.http.get(this.baseUrl + '/search/' + keyword)
               .toPromise()
               .then(response => response.json() as Protocol[])
               .catch(this.handleError);
   }


  searchSync(keyword: string): Observable<any[]> {
    return this.httpClient.get<any>(this.baseUrl + '/search/' + keyword);
   }

  save(item: Protocol): Promise<Protocol> {
    return this.http.put(this.baseUrl + '/' + item.id, item)
    .toPromise()
    .then(response => response.json() as Protocol)
    .catch(this.handleError);
  }

  delete(contact: Protocol): Promise<Protocol> {
    return this.http.delete(this.baseUrl + '/' + contact.id)
    .toPromise()
    .then(response => response.json() as Protocol)
    .catch(this.handleError);
  }

  new(): Promise<Protocol> {
    return this.http.post(this.baseUrl, {})
    .toPromise()
    .then(response => response.json() as Protocol)
    .catch(this.handleError);
  }

 private handleError(error: any): Promise<any> {
   console.error('An error occurred', error); // for demo purposes only
   return Promise.reject(error.message || error);
 }

}
