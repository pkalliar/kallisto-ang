import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Protocol } from './protocol';
import { ProtocolDetailComponent } from './protocol-detail.component';
import { ProtocolService } from '../protocols/protocol.service';

// my comment on Monday morning
@Component({
  selector: 'app-protocols',
  templateUrl: './protocols.component.html',
  styleUrls: ['./protocols.component.css'],
  providers: []
})
export class ProtocolsComponent implements OnInit {
  selectedProtocol: Protocol;

  protocols: Protocol[];

  constructor(
    private router: Router,
    private protocolService: ProtocolService) { }

  getProtocols(): void {
    this.protocolService.getProtocolsSlowly().then(protocols => this.protocols = protocols);
  }

  ngOnInit(): void {
    this.getProtocols();
  }

  onSelect(protocol: Protocol): void {
    this.selectedProtocol = protocol;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedProtocol.id]);
  }

}



