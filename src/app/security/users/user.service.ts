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
    constructor(private httpClient: HttpClient) {
      this.url  = 'https://api.datamuse.com/words?ml=';

    }

    search_word(term) {
        return this.httpClient.get(this.baseUrl + '/search/' + term).map(res => {
            return res as User[];
        });
    }


    getOne(id: string): Promise<User> {
        // return this.getContacts()
        //      .then(contacts => contacts.find(contact => contact.id === id));
        return this.httpClient.get(this.baseUrl + '/' + id)
             .toPromise()
             .then(response => response)
             .catch(this.handleError);
    }

    get(filter: any): Promise<User[]> {
     return this.httpClient.get(this.baseUrl + '/filter/' + filter)
                .toPromise()
                .then(response => response as User[])
                .catch(this.handleError);
    }

    search(keyword: string): Promise<User[]> {
      return this.httpClient.get(this.baseUrl + '/search/' + keyword)
                 .toPromise()
                 .then(response => response as User[])
                 .catch(this.handleError);
     }


    searchSync(keyword: string): Observable<any[]> {
      return this.httpClient.get<any>(this.baseUrl + '/search/' + keyword);
     }

    save(contact: User): Promise<User> {
      return this.httpClient.put(this.baseUrl + '/' + contact.id, contact)
      .toPromise()
      .then(response => response as User)
      .catch(this.handleError);
    }

    delete(contact: User): Promise<User> {
      return this.httpClient.delete(this.baseUrl + '/' + contact.id)
      .toPromise()
      .then(response => response as User)
      .catch(this.handleError);
    }

    new(): Promise<User> {
      return this.httpClient.post(this.baseUrl, {})
      .toPromise()
      .then(response => response as User)
      .catch(this.handleError);
    }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
