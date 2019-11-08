import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from 'angularfire2/firestore';


import { Person } from './person';
import {environment} from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PersonService {

    private baseUrl = environment.apiurl + '/api/persons';  // URL to web api
    url: string;
    constructor(private http: Http, private httpClient: HttpClient, private afs: AngularFirestore) {
      this.url  = 'https://api.datamuse.com/words?ml=';

    }

    // search both contacts and groups
    search_word(term) {
        return this.http.get(this.baseUrl + '/searchAll/' + term).pipe(map(res => {
            return res.json();
            // .map(item => {
            //     return item;
            // });
        }));
    }


    getOne(id: string): Promise<Person> {
        // return this.getContacts()
        //      .then(contacts => contacts.find(contact => contact.id === id));
        return this.http.get(this.baseUrl + '/' + id)
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
    }

    get(filter: any): Promise<Person[]> {
     return this.httpClient.get(this.baseUrl + '/filter/' + filter)
                .toPromise()
                .then(response => response as Person[])
                .catch(this.handleError);
    }

    getFB(filter: any) {
      console.log('filtering with ' + filter);
      return this.afs.firestore.collection('persons')
      .where('apikey', '==', filter)
      .get().then(querySnapshot => {

        return querySnapshot.docs.map
        ((doc) => {
            const a = new Person();
            a.id = doc.id;
            a.firstname = doc.get('firstname');
            a.lastname = doc.get('lastname');
            a.mobile = doc.get('mobile');
            return a;
        });


      });

    }

    search(keyword: string): Promise<Person[]> {
      return this.http.get(this.baseUrl + '/search/' + keyword)
                 .toPromise()
                 .then(response => response.json() as Person[])
                 .catch(this.handleError);
     }

    searchSync(keyword: string): Observable<Person[]> {
      return this.httpClient.get<Person[]>(this.baseUrl + '/search/' + keyword);
     }


    searchContact(keyword: string): Observable<any[]> {
      return this.httpClient.get<any>(this.baseUrl + '/searchAll/' + keyword);
     }

    save(entity: Person): Promise<Person> {
      return this.http.put(this.baseUrl + '/' + entity.id, entity)
      .toPromise()
      .then(response => response.json() as Person)
      .catch(this.handleError);
    }

    delete(entity: Person): Promise<Person> {
      return this.http.delete(this.baseUrl + '/' + entity.id)
      .toPromise()
      .then(response => response.json() as Person)
      .catch(this.handleError);
    }

    new(): Promise<Person> {
      return this.http.post(this.baseUrl, {})
      .toPromise()
      .then(response => response.json() as Person)
      .catch(this.handleError);
    }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
