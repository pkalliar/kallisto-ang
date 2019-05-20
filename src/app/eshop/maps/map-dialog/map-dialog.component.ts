import { Component, Inject } from '@angular/core';
import { MapLayer } from '../map/map.component';
import { MapService, DialogData } from '../map.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'app-map-dialog',
    templateUrl: 'map-dialog.html',
  })
  export class MapDialogComponent {


    mapLayers: MapLayer[] = [];
    points = [];
    // @ViewChild(MatSelectionList) selectionList: MatSelectionList;

    constructor(
      private srv: MapService,
      public dialogRef: MatDialogRef<MapDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData ) {

  // MapLayer[]
        if (data.type === this.srv.NAVTEX_DETAIL) {

        } else if (data.type === this.srv.NAVTEX_LIST) {
          this.mapLayers = data.data;
        }

        console.log();
      }

    onNoClick(): void {
      this.dialogRef.close();
    }

    onNavDetailClick(): void {
      this.dialogRef.close({
        type: this.srv.NAVTEX_DETAIL,
        data: this.points
      });
    }

    onNavListClick(): void {
      this.dialogRef.close({
        type: this.srv.NAVTEX_LIST,
        data: this.mapLayers
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
    this.points = resp;
   }

  }
