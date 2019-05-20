import { Component, OnInit } from '@angular/core';
import { MapService, NavtexData } from '../map.service';

@Component({
  selector: 'pk-navtex-list',
  templateUrl: './navtex-list.component.html',
  styleUrls: ['./navtex-list.component.css']
})
export class NavtexListComponent implements OnInit {

  nvtxs: NavtexData[] = [];

  constructor(private mapSrv: MapService) { }

  ngOnInit() {
    this.mapSrv.searchNavtexDB('')
      .then(response => {
        response.forEach((doc) => {
          const nvtx = this.mapSrv.getFromToken(doc);
          this.nvtxs.push(nvtx);
          console.log(doc.get('name'));
          console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
        });
    });
  }

}
