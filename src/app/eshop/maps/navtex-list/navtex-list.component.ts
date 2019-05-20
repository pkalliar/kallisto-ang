import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'pk-navtex-list',
  templateUrl: './navtex-list.component.html',
  styleUrls: ['./navtex-list.component.css']
})
export class NavtexListComponent implements OnInit {

  constructor(private mapSrv: MapService) { }

  ngOnInit() {
    this.mapSrv.searchNavtexDB('')
      .then(response => {
        response.forEach((doc) => {
          console.log(doc.get('name'));
          console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
        });
    });
  }

}
