import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class SkroutzService {

    url  = 'https://api.datamuse.com/words?ml=';
    private baseUrl = this.url  + '/api/skroutz';  // URL to web api

    constructor(private http: Http, private httpClient: HttpClient) {


    }

    search_word(keyword) {
      console.log('in search word..');
      return this.http.get(this.baseUrl + '/search/' + keyword)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
        // return this.http.get(this.baseUrl + '/search/' + term).map(res => {
        //     return res.json().map(item => {
        //         return item;
        //     });
        // });
    }



   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
