import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import { User } from './user';
import {environment} from '../../../environments/environment';

@Injectable()
export class UserService {

    private baseUrl = environment.apiurl + '/api/users';  // URL to web api
    url: string;
    constructor(private http: Http, private httpClient: HttpClient) {
      this.url  = 'https://api.datamuse.com/words?ml=';

    }

    search_word(term) {
        return this.http.get(this.baseUrl + '/search/' + term).map(res => {
            return res.json().map(item => {
                return item;
            });
        });
    }


    getOne(id: string): Promise<User> {
        // return this.getContacts()
        //      .then(contacts => contacts.find(contact => contact.id === id));
        return this.http.get(this.baseUrl + '/' + id)
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
    }

    get(filter: any): Promise<User[]> {
     return this.http.get(this.baseUrl + '/filter/' + filter)
                .toPromise()
                .then(response => response.json() as User[])
                .catch(this.handleError);
    }

    search(keyword: string): Promise<User[]> {
      return this.http.get(this.baseUrl + '/search/' + keyword)
                 .toPromise()
                 .then(response => response.json() as User[])
                 .catch(this.handleError);
     }


    searchSync(keyword: string): Observable<any[]> {
      return this.httpClient.get<any>(this.baseUrl + '/search/' + keyword);
     }

    save(contact: User): Promise<User> {
      return this.http.put(this.baseUrl + '/' + contact.id, contact)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
    }

    delete(contact: User): Promise<User> {
      return this.http.delete(this.baseUrl + '/' + contact.id)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
    }

    new(): Promise<User> {
      return this.http.post(this.baseUrl, {})
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
    }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}