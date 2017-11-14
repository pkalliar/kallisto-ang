import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Contact } from './contact';

@Injectable()
export class ContactService {

    private contactsUrl = 'http://127.0.0.1:8090/api/contacts';  // URL to web api
    constructor(private http: Http) { }


    getContact(id: string): Promise<Contact> {
        return this.getContacts()
             .then(contacts => contacts.find(contact => contact.id === id));
    }

    getContacts(): Promise<Contact[]> {
     return this.http.get(this.contactsUrl)
                .toPromise()
                .then(response => response.json() as Contact[])
                .catch(this.handleError);
   }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
