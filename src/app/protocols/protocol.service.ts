import { Injectable } from '@angular/core';

import { Protocol } from '../protocol';
import { PROTOCOLS } from './mock-protocols';

@Injectable()
export class ProtocolService {
  getProtocols(): Promise<Protocol[]> {
    return Promise.resolve(PROTOCOLS);
  }
}
