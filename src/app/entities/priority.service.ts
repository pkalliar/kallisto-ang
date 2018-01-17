import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Priority } from './priority';

@Injectable()
export class PriorityService {

    private prioritiesUrl = 'http://127.0.0.1:8090/api/priorities';  // URL to web api
    constructor(private http: Http) { }


    getPriority(id: string): Promise<Priority> {
        // return this.getContacts()
        //      .then(contacts => contacts.find(contact => contact.id === id));
        return this.http.get(this.prioritiesUrl + '/' + id)
             .toPromise()
             .then(response => response.json())
             .catch(this.handleError);
    }

    getPriorities(): Promise<Priority[]> {
     return this.http.get(this.prioritiesUrl)
                .toPromise()
                .then(response => response.json() as Priority[])
                .catch(this.handleError);
    }

    searchPriorities(keyword: string): Promise<Priority[]> {
      return this.http.get(this.prioritiesUrl + '/search/' + keyword)
                 .toPromise()
                 .then(response => response.json() as Priority[])
                 .catch(this.handleError);
     }

    savePriority(priority: Priority): Promise<Priority> {
      return this.http.put(this.prioritiesUrl + '/' + priority.priority, priority)
      .toPromise()
      .then(response => response.json() as Priority)
      .catch(this.handleError);
    }

    newPriority(): Promise<Priority> {
      return this.http.post(this.prioritiesUrl, {})
      .toPromise()
      .then(response => response.json() as Priority)
      .catch(this.handleError);
    }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
