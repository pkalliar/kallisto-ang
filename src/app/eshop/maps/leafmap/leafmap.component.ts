import { Component, OnInit, Input } from '@angular/core';

// declare let L;
import * as L from 'leaflet';
// import printJS from 'print-js';
import 'leaflet-easyprint';
import * as omnivore from '@mapbox/leaflet-omnivore';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

import { NavtexData, MapLayer, Geoshape } from '../navtex-data';
import { MapService } from '../map.service';

@Component({
  selector: 'pk-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.css']
})
export class LeafmapComponent implements OnInit {

  @Input() coordinates = {
    lat: 34.04578,
    lng: 29.46754
    };

    mymap: L.Map;
    myCenter: L.LatLng;
    mapLayers: MapLayer[] = [];
    nvtxs: NavtexData[] = [];
    blockMarkers: any[] = [];
    printer: any;

  constructor(public mapSrv: MapService) { }

  ngOnInit() {
    this.mymap = L.map('mapid', {
      zoomControl: false
    }).setView([this.coordinates.lat, this.coordinates.lng], 7);

    const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Embassy of Greece in Nicosia',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoicGthbGxpYXJhcyIsImEiOiJjazRiMjAwYnEwOWhsM3JwODZsbnd2dXg2In0.taV3ZnuTWm-24Co_sgzm4w'
    }).addTo(this.mymap);

    this.printer = (L as any).easyPrint({
      sizeModes: ['Current', 'A4Landscape'],
      hidden: 'true',
      position: 'bottomleft',
      hideControlContainer: false,
      exportOnly: true
    }).addTo(this.mymap);

    // var printPlugin = L.easyPrint({
    //   title: 'My awesome print button',
    //   position: 'topright',
    //   sizeModes: ['A4Portrait', 'A4Landscape']
    // }).addTo(mymap);

    // printPlugin.printMap('A4Portrait', 'MyFileName');
  }

  @Input() snapshot() {
    console.log('printing..');
    // window.print();
    // printJS('mapid', 'html');
    this.printer.printMap('A4Landscape page', 'navmap');
    // html2canvas(document.querySelector('#mapid')).then(canvas => {
    //   if (canvas) {
    //     canvas.toBlob(function(blob) {
    //       saveAs(blob, 'navtex-map.jpg');
    //     });
    //   }
    // });
  }

  @Input() centerMap(lat: number, lng: number) {
    this.myCenter = L.latLng(lat, lng);
    this.mymap.setView(this.myCenter, 7);
  }

  @Input() onNavtexFocus(resp: any) {
    this.nvtxs.forEach(nvtx => {
      if (nvtx.id === resp.id) {
        this.mymap.setView(nvtx.geoshapes[0].obj[0], 7);
      }
    });
  }

  @Input() onNavtexSelection(nvtx: NavtexData) {

    let found  = false;
    for (let i = 0; i < this.nvtxs.length; i++) {
      if (this.nvtxs[i].id === nvtx.id) {
        found = true;
        if (!nvtx.show) {
          this.nvtxs.splice(i, 1);
          this.updateObject(nvtx.geoshapes, nvtx.show);
        }
      }
    }
    if (!found) {
      const nvtx2 = this.drawNavtex(nvtx);
      this.nvtxs.push(nvtx2);
    }

    // const area = this.mapSrv.getArea(nvtx);
    // const descr = nvtx.name + ' Ολική επιφάνεια: ' + (area / 1000000).toFixed(0) + ' τ. χλμ.';
    // console.log('leaflet ' + descr);



  }

  @Input() drawLayer(layer: MapLayer) {
    // console.log(layer);
    let exists = false;
    this.mapLayers.forEach(l => {
      // console.log(l);
      if (l.kmlFile === layer.kmlFile && l.layer) {
        exists = true;
        if ( layer.show === true ) {
          l.layer.addTo(this.mymap);
          if (layer.kmlFile === 'BLOCKS.kml') {
            this.drawBlockNumbers();
          }
        } else {
          l.layer.removeFrom(this.mymap);
          if (layer.kmlFile === 'BLOCKS.kml') {
            this.removeBlockNumbers();
          }
        }
      }
    });
    if (!exists) {
      let color = 'black';
      if ( layer.color !== null) {
        color = layer.color;
      }
      const customLayer = (L as any).geoJson(null, {
        style: function(feature) {      return {
            color: color, weight: 2
      }; }});
      layer.layer = omnivore.kml('assets/maps/' + layer.kmlFile, null, customLayer)
      .on('ready', function() {
        // console.log(layer.layer);
      });

      this.mapLayers.push(layer);
      layer.layer.addTo(this.mymap);
      if (layer.kmlFile === 'BLOCKS.kml') {
        this.drawBlockNumbers();
      }
    }

  }

  drawNavtex(nvtx: NavtexData) {

    const area = this.mapSrv.getArea(nvtx);
    const descr = nvtx.name + ' Ολική επιφάνεια: ' + (area / 1000000).toFixed(0) + ' τ. χλμ.';

    nvtx.geoshapes.forEach(shape => {
      console.log(shape.type + ' ' + this.mapSrv.shapes[0]);
      // if ( shape.type === this.mapSrv.shapes[0]) {
        shape.obj = this.drawNavtexPart(shape.points, nvtx.station_name, nvtx.name, shape.type, descr);
      // }
    });
    nvtx.show = true;
    return nvtx;
  }

  drawNavtexPart(data, station, label, type, descr) {
    const res = [];
    if (data.length > 1) {

      if ( type === this.mapSrv.shapes[0]) {
        const latlngs = [];
        data.forEach(point => {
          latlngs.push([point.lat, point.lng]);
        });
        latlngs.push([data[0].lat, data[0].lng]);
        // const mymarker = this.addSVGLabelMarker(label, this.map, data[0]);
        // shapes.push(mymarker);

        const polygon = L.polygon(latlngs).addTo(this.mymap);
        polygon.bindPopup(descr);

        const myIcon = L.divIcon({className: 'my-div-icon', html: '<b>' + label + '</b>'});
        const marker = L.marker([data[0].lat, data[0].lng], {icon: myIcon}).addTo(this.mymap);

        res.push(polygon);
        res.push(marker);
      }
      // if ( type === this.mapSrv.shapes[2]) {
      //   data.forEach(point => {
      //     const mymarker = new H.map.Marker(point);
      //     this.map.addObject(mymarker);
      //     shapes.push(mymarker);
      //   });
      // }

    }
    return res;
  }

  updateObject(shps: Geoshape[], show: boolean) {
    try {
      if (show) {
        shps.forEach(shp => {
          shp.obj.forEach(obj => {
            obj.remove();
            obj.addTo(this.mymap);
            // this.map.removeObject(obj);
            // const obj2 = this.map.addObject(obj);
            // this.map.setViewBounds(obj2);
          });
        });
      } else {
        console.log(shps);
        shps.forEach(shp => {
          shp.obj.forEach(obj => {
            obj.remove();
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  drawBlockNumbers() {
    this.drawBlockNum(1, 34.2764, 32.8192);
    this.drawBlockNum(2, 34.4137, 33.9234);
    this.drawBlockNum(3, 34.5948, 34.6155);
    this.drawBlockNum(4, 33.8682, 30.3967);
    this.drawBlockNum(5, 33.8682, 30.9241);
    this.drawBlockNum(6, 33.8682, 31.6162);
    this.drawBlockNum(7, 33.8682, 32.2644);
    this.drawBlockNum(8, 33.8682, 32.9456);
    this.drawBlockNum(9, 33.8682, 33.5498);
    this.drawBlockNum(10, 33.300, 31.7041);
    this.drawBlockNum(11, 33.300, 32.2754);
    this.drawBlockNum(12, 33.300, 32.9785);
    this.drawBlockNum(13, 33.9867, 34.1321);
  }

  removeBlockNumbers() {
    this.blockMarkers.forEach(blockMarker => {
      blockMarker.remove();
    });

    this.blockMarkers.length = 0;
  }

  drawBlockNum(label, lat, lng) {
    const myIcon = L.divIcon({className: 'my-div-icon', html: '<b>' + label + '</b>'});
    const blockMarker = L.marker([lat, lng], {icon: myIcon}).addTo(this.mymap);
    this.blockMarkers.push(blockMarker);
  }

}
