import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class ContactService {

    private contactsUrl = 'http://192.168.100.128:8090/api/skroutz';  // URL to web api
    url: string;
    constructor(private http: Http, private httpClient: HttpClient) {
      this.url  = 'https://api.datamuse.com/words?ml=';

    }

    search_word(term) {
        return this.http.get(this.contactsUrl + '/search/' + term).map(res => {
            return res.json().map(item => {
                return item;
            });
        });
    }



   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
