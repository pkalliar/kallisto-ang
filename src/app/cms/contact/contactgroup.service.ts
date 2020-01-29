import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import {Observable} from 'rxjs';

import { Contact, ContactGroup, ContactGroupFull } from './contact';
import {environment} from '../../../environments/environment';

@Injectable()
export class ContactGroupService {

    private contactsUrl = environment.apiurl + '/apiV2/contact-groups';  // URL to web api
    url: string;
    constructor(private http: Http, private httpClient: HttpClient) {
    }


    get(id: string): Promise<ContactGroup> {
        // return this.getContacts()
        //      .then(contacts => contacts.find(contact => contact.id === id));
        return this.http.get(this.contactsUrl + '/' + id)
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
    }





    save(contact: Contact): Promise<Contact> {
      return this.http.put(this.contactsUrl + '/' + contact.id, contact)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
    }

    delete(contact: Contact): Promise<Contact> {
      return this.http.delete(this.contactsUrl + '/' + contact.id)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
    }

    new(): Promise<Contact> {
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
