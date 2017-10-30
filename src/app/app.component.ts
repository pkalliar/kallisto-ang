import { Component, OnInit } from '@angular/core';
import { Protocol } from './protocol';
import { ProtocolDetailComponent } from './protocol-detail.component';
import { ProtocolService } from './protocols/protocol.service';

// my comment on Monday morning
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ProtocolService]
})
export class AppComponent implements OnInit {
  title = 'Angular pankal app';
  selectedProtocol: Protocol;

  protocols: Protocol[];

  constructor(private protocolService: ProtocolService) { }

  getProtocols(): void {
    this.protocolService.getProtocols().then(protocols => this.protocols = protocols);
  }

  ngOnInit(): void {
    this.getProtocols();
  }

  onSelect(protocol: Protocol): void {
    this.selectedProtocol = protocol;
  }

}



