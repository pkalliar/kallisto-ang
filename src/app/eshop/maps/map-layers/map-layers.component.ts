import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from '../map.service';
import { MapLayer } from '../navtex-data';

@Component({
  selector: 'pk-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.css']
})
export class MapLayersComponent implements OnInit {

  @Input() mapLayers: MapLayer[] = [];

  @Output() layerSelected = new EventEmitter<Object>();


  constructor(public srv: MapService) { }

  ngOnInit() {
  }

  onLayerSelection(e, v) {
    // console.log(e.option.value);
    // console.log(e.option.selected);

    this.mapLayers.forEach(layer => {
      if (layer.name === e.option.value.name) {
        layer.show = e.option.selected;

        this.layerSelected.emit(layer);
      }
      // console.log(layer.name);

    });
    console.log(v.selected);
    // v.selected.forEach(function(layer) {
    //   console.log(layer.value);
    // });
 }

}
