import { Injectable } from '@angular/core';

import { Protocol } from '../protocol';
import { PROTOCOLS } from './mock-protocols';

@Injectable()
export class ProtocolService {
  getProtocols(): Promise<Protocol[]> {
    return Promise.resolve(PROTOCOLS);
  }

  getProtocolsSlowly(): Promise<Protocol[]> {
  return new Promise(resolve => {
    // Simulate server latency with 2 second delay
    setTimeout(() => resolve(this.getProtocols()), 2000);
  });
}
}
