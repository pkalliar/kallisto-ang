import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MapService, NavtexData } from '../map.service';

@Component({
  selector: 'pk-navtex-list',
  templateUrl: './navtex-list.component.html',
  styleUrls: ['./navtex-list.component.css']
})
export class NavtexListComponent implements OnInit {

  @Input() nvtxs: NavtexData[] = [];

  @Output() navtexSelected = new EventEmitter<Object>();
  @Output() closePressed = new EventEmitter<Object>();

  constructor(private mapSrv: MapService) { }

  ngOnInit() {
     if (this.nvtxs.length  === 0) {
      this.mapSrv.searchNavtexDB('')
        .then(response => {
          response.forEach((doc) => {
            const nvtx = this.mapSrv.getFromToken(doc);
            this.nvtxs.push(nvtx);
            // console.log(doc.get('name'));
            // console.log(`${doc.id} => ${JSON.stringify(doc.data)} `);
          });
      });
    }

  }

  onVisibilityClick(i: number) {
    this.nvtxs[i].show = !this.nvtxs[i].show;
    this.navtexSelected.emit(this.nvtxs);
    // sessionStorage.setItem('user', this.nvtxs[i]);
    // this.nvtxs.forEach(function(nvtx) {
    //   if (nvtx.name === e.option.value.name) {
    //     nvtx.show = e.option.selected;
    //   }
    //   console.log(nvtx.name);
    // });
  }

}
