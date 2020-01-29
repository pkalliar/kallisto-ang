import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import { environment } from '../../../environments/environment';

import { Item } from './item';

@Injectable()
export class ItemService {

    private protocolsUrl = environment.apiurl +  '/api/items';  // URL to web api
    constructor(private http: Http) { }

    // getProtocols(): Promise<Protocol[]> {
    //     return Promise.resolve(PROTOCOLS);
    // }

    getProtocolsSlowly(): Promise<Item[]> {
        return new Promise(resolve => {
            // Simulate server latency with 2 second delay
            setTimeout(() => resolve(this.getProtocols()), 500);
        });
    }

    getProtocol(id: number): Promise<Item> {
        return this.getProtocols()
             .then(protocols => protocols.find(protocol => protocol.id === id));
    }

    getProtocols(): Promise<Item[]> {
     return this.http.get(this.protocolsUrl)
                .toPromise()
                .then(response => response.json() as Item[])
                .catch(this.handleError);
   }

   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
