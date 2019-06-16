import { Component, Inject } from '@angular/core';
import { MapLayer } from '../map/map.component';
import { MapService, DialogData } from '../map.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavtexData } from '../navtex-data';


@Component({
    selector: 'app-map-dialog',
    templateUrl: 'map-dialog.html',
  })
  export class MapDialogComponent {


    mapLayers: MapLayer[] = [];
    points = [];
    navtexData: NavtexData;
    nvtxs: NavtexData[] = [];
    // @ViewChild(MatSelectionList) selectionList: MatSelectionList;

    constructor(
      public srv: MapService,
      public dialogRef: MatDialogRef<MapDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData ) {

  // MapLayer[]
        if (data.type === this.srv.NAVTEX_DETAIL) {

        } else if (data.type === this.srv.LAYER_LIST) {
          this.mapLayers = data.data;
        } else if (data.type === this.srv.NAVTEX_LIST) {
          this.nvtxs = data.data;
          // LAYER LIST SELECTED
        }

        console.log();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

    onLayerListClick(): void {
      this.dialogRef.close({
        type: this.srv.LAYER_LIST,
        data: this.mapLayers
      });
    }

    onNavDetailClick(): void {
      this.srv.saveNavtex(this.navtexData);
      this.dialogRef.close({
        type: this.srv.NAVTEX_DETAIL,
        data: this.navtexData
      });
    }

    onNavListClick(): void {
      this.dialogRef.close({
        type: this.srv.NAVTEX_LIST,
        data: this.nvtxs
      });
    }

    onLayerSelection(e, v) {
      console.log(e.option.value);
      console.log(e.option.selected);

      this.mapLayers.forEach(function(layer) {
        if (layer.name === e.option.value.name) {
          layer.show = e.option.selected;
        }
        console.log(layer.name);
      });
      console.log(v.selected);
      // v.selected.forEach(function(layer) {
      //   console.log(layer.value);
      // });
   }

   onPositioned(resp: any) {
    console.log(resp);
    this.navtexData = resp;
   }

   onNavtexSelection(resp: any) {
    console.log(resp);
    this.nvtxs = resp;

   }

  }
