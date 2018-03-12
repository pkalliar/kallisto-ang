import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import { Folder } from './folder';
import {environment} from '../../../environments/environment';

@Injectable()
export class FolderService {

    private baseUrl = 'http://' +  environment.apiurl + '/api/folders';  // URL to web api
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


    getFolder(id: string): Promise<Folder> {
        // return this.getContacts()
        //      .then(contacts => contacts.find(contact => contact.id === id));
        return this.http.get(this.baseUrl + '/' + id)
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
    }

    getFolders(filter: any): Promise<Folder[]> {
     return this.http.get(this.baseUrl + '/filter/' + filter)
                .toPromise()
                .then(response => response.json() as Folder[])
                .catch(this.handleError);
    }

    searchFolders(keyword: string): Promise<Folder[]> {
      return this.http.get(this.baseUrl + '/search/' + keyword)
                 .toPromise()
                 .then(response => response.json() as Folder[])
                 .catch(this.handleError);
     }


    searchFolder(keyword: string): Observable<any[]> {
      return this.httpClient.get<any>(this.baseUrl + '/search/' + keyword);
     }

    saveFolder(contact: Folder): Promise<Folder> {
      return this.http.put(this.baseUrl + '/' + contact.id, contact)
      .toPromise()
      .then(response => response.json() as Folder)
      .catch(this.handleError);
    }

    deleteFolder(contact: Folder): Promise<Folder> {
      return this.http.delete(this.baseUrl + '/' + contact.id)
      .toPromise()
      .then(response => response.json() as Folder)
      .catch(this.handleError);
    }

    newFolder(): Promise<Folder> {
      return this.http.post(this.baseUrl, {})
      .toPromise()
      .then(response => response.json() as Folder)
      .catch(this.handleError);
    }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
