import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import { Contact } from './contact';

@Injectable()
export class ContactService {

    private contactsUrl = 'http://192.168.100.128:8090/api/contacts';  // URL to web api
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


    getContact(id: string): Promise<Contact> {
        // return this.getContacts()
        //      .then(contacts => contacts.find(contact => contact.id === id));
        return this.http.get(this.contactsUrl + '/' + id)
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
    }

    getContacts(filter: any): Promise<Contact[]> {
     return this.http.get(this.contactsUrl + '/filter/' + filter)
                .toPromise()
                .then(response => response.json() as Contact[])
                .catch(this.handleError);
    }

    searchContacts(keyword: string): Promise<Contact[]> {
      return this.http.get(this.contactsUrl + '/search/' + keyword)
                 .toPromise()
                 .then(response => response.json() as Contact[])
                 .catch(this.handleError);
     }


    searchContact(keyword: string): Observable<any[]> {
      return this.httpClient.get<any>(this.contactsUrl + '/search/' + keyword);
     }

    saveContact(contact: Contact): Promise<Contact> {
      return this.http.put(this.contactsUrl + '/' + contact.id, contact)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
    }

    deleteContact(contact: Contact): Promise<Contact> {
      return this.http.delete(this.contactsUrl + '/' + contact.id)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
    }

    newContact(): Promise<Contact> {
      return this.http.post(this.contactsUrl, {})
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
    }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
