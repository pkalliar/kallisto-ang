import { Component, Input } from '@angular/core';

import { Protocol } from './protocol';

@Component({
  selector: 'protocol-detail',
  templateUrl: './protocol-detail.component.html',
})
export class ProtocolDetailComponent {
    @Input() protocol: Protocol;
}