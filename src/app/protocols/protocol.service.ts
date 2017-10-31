import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Protocol } from './protocol';
import { PROTOCOLS } from './mock-protocols';

@Injectable()
export class ProtocolService {

    private heroesUrl = 'api/heroes';  // URL to web api
    constructor(private http: Http) { }

    // getProtocols(): Promise<Protocol[]> {
    //     return Promise.resolve(PROTOCOLS);
    // }

    getProtocolsSlowly(): Promise<Protocol[]> {
        return new Promise(resolve => {
            // Simulate server latency with 2 second delay
            setTimeout(() => resolve(this.getProtocols()), 500);
        });
    }

    getProtocol(id: number): Promise<Protocol> {
        return this.getProtocols()
             .then(protocols => protocols.find(protocol => protocol.id === id));
    }

    getProtocols(): Promise<Protocol[]> {
     return this.http.get(this.heroesUrl)
                .toPromise()
                .then(response => response.json().data as Protocol[])
                .catch(this.handleError);
   }
    
   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
