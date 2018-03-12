import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from './item';
// import { ProtocolDetailComponent } from './protocol-detail.component';
import { ItemService } from './item.service';

// my comment on Monday morning
@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  styleUrls: ['./items.css'],
  providers: []
})
export class ItemsComponent implements OnInit {
  selectedProtocol: Item;

  items: Item[];

  constructor(
    private router: Router,
    private itemService: ItemService) { }

  getProtocols(): void {
    this.itemService.getProtocolsSlowly().then(items => this.items = items);
  }

  ngOnInit(): void {
    this.getProtocols();
  }

  onSelect(protocol: Item): void {
    this.selectedProtocol = protocol;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedProtocol.id]);
  }

}



