import { Component, OnInit } from '@angular/core';
import { ProtocolService } from '../protocols/protocol.service';
import { Protocol } from '../protocols/protocol';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  protocols: Protocol[] = [];

  constructor(private protocolService: ProtocolService) { }

  ngOnInit(): void {
    this.protocolService.getProtocols()
      .then(protocols => this.protocols = protocols.slice(1, 5));
  }
}
