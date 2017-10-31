import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { ProtocolService } from './protocol.service';

import { Protocol } from './protocol';

@Component({
  selector: 'protocol-detail',
  templateUrl: './protocol-detail.component.html',
})



export class ProtocolDetailComponent implements OnInit{
    @Input() protocol: Protocol;

    constructor(
      private protocolService: ProtocolService,
      private route: ActivatedRoute,
      private location: Location
    ) {}

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.protocolService.getProtocol(+params.get('id')))
        .subscribe(protocol => this.protocol = protocol);
    }

}
