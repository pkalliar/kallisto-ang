import { Component, OnInit, Input } from '@angular/core';
import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import OSMSource from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import Graticule from 'ol/layer/Graticule';
import {Circle as CircleStyle, Fill, Stroke, Style, Text, RegularShape} from 'ol/style';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import LinearRing from 'ol/geom/LinearRing';
import MultiPoint from 'ol/geom/MultiPoint';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import {toPng, toBlob} from 'html-to-image';
import { saveAs } from 'file-saver';
import { MapService } from '../map.service';
import { NavtexData, Geoshape, MapLayer } from '../navtex-data';
import * as olProj from 'ol/proj';
import KML from 'ol/format/KML';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';

import { environment } from '../../../../environments/environment';


@Component({
  selector: 'pk-open-layers-map',
  templateUrl: './open-layers-map.component.html',
  styleUrls: ['./open-layers-map.component.css']
})
export class OpenLayersMapComponent implements OnInit {

  mymap: Map;
  graticuleLayer: Graticule;
  nvtxs: NavtexData[] = [];
  mapLayers: MapLayer[] = [];

  layers = [];
  blockMarkers: any[] = [];

  exportOptions = {
    filter: function(element) {
      return element.className ? element.className.indexOf('ol-control') === -1 : true;
    }
  };


  constructor(public mapSrv: MapService) { }

  ngOnInit() {

    // this.layers.push(new TileLayer({
    //   source: new OSMSource()
    // }));



    var urlTpl2 = 'https://{1-4}.base.maps.cit.api.here.com' +
  '/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png' +
  '?app_id={app_id}&app_code={app_code}';

  const urlTpl = 'https://{1-4}.base.maps.cit.api.here.com' +
  '/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?' +
  'app_id=' + environment.heremaps.appId +
  '&app_code=' + environment.heremaps.appCode;

    const hereLayer = new TileLayer({
      visible: true,
      preload: Infinity,
      source: new XYZ({
        url: urlTpl,
        crossOrigin: "Anonymous",
        attributions: 'Map Tiles &copy; ' + new Date().getFullYear() + ' ' +
          '<a href="http://developer.here.com">HERE</a>'
      })
    });
    this.layers.push(hereLayer);

    this.graticuleLayer = new Graticule({
      // the style to use for the lines, optional.
      strokeStyle: new Stroke({
        color: 'rgba(255,120,0,0.9)',
        width: 2,
        lineDash: [0.5, 4]
      }),
      showLabels: true,
      wrapX: false
    });

    // this.layers.push(this.graticuleLayer);

    this.mymap = new Map({
      target: 'map',
      controls: [],
      layers: this.layers,
      view: new View({
        center: fromLonLat([29.46754, 34.04578]),
        zoom: 7
      })
    });
  }

  @Input() centerMap(lat: number, lng: number) {
    this.mymap.setView(
    new View({
      center: fromLonLat([lng, lat]),
      zoom: 7
    }));
  }

  @Input() snapshot() {
    console.log('printing..');
    this.mymap.once('rendercomplete', () => {
      toBlob(this.mymap.getTargetElement(), this.exportOptions)
        .then(function(blob) {
          saveAs(blob, 'navtex-map.jpg');
        });
    });
    this.mymap.renderSync();
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
          // if (layer.kmlFile === 'BLOCKS.kml') {
          //   this.drawBlockNumbers();
          // }
        } else {
          l.layer.removeFrom(this.mymap);
          // if (layer.kmlFile === 'BLOCKS.kml') {
          //   this.removeBlockNumbers();
          // }
        }
      }
    });
    if (!exists) {
      let color = 'black';
      if ( layer.color !== null) {
        color = layer.color;
      }

      layer.layer = new VectorLayer({
        source: new VectorSource({
          url: 'assets/maps/' + layer.kmlFile,
          format: new KML()
        })
      });

      const feats = new KML().readFeatures({
        source: new VectorSource({
          url: 'assets/maps/' + layer.kmlFile,
          format: new KML()
        }),
        options: {}
      });

      console.log(JSON.stringify(feats));

      this.mapLayers.push(layer);
      this.mymap.addLayer(layer.layer);

      if (layer.kmlFile === 'BLOCKS.kml') {
        this.drawBlockNumbers();
      }
    }

  }

  @Input() drawGeoJson(){
    var source = new VectorSource({
      url: 'assets/maps/BLOCKS.geojson',
      format: new GeoJSON()
    });
    this.mymap.addLayer(source);
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
          console.log(point);
          // new Point([point.lng, point.lat]);
          // latlngs.push(new Point([point.lng, point.lat]));

          latlngs.push(olProj.transform([point.lng, point.lat], 'EPSG:4326', 'EPSG:3857'));

        });
        // latlngs.push(new Point([data[0].lng, data[0].lat]) );
        latlngs.push(olProj.transform([data[0].lng, data[0].lat], 'EPSG:4326', 'EPSG:3857'));
        // const mymarker = this.addSVGLabelMarker(label, this.map, data[0]);
        // shapes.push(mymarker);

        console.log(latlngs);

        var labelStyle = new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          }),
          text:  new Text({
            font: '12px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
              color: '#000'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3
            })
          })
        });

        var circleStyle = new Style({
          image: new CircleStyle({
            radius: 3,
            fill: new Fill({
              color: 'orange'
            })
          }),
          geometry: function(feature) {
            // return the coordinates of the first ring of the polygon
            var coordinates = feature.getGeometry().getCoordinates()[0];
            return new MultiPoint(coordinates);
          }
        });


        var styles = [labelStyle, circleStyle];

        // var linearRing = new LinearRing(latlngs);

        const polygon = new Polygon([latlngs]);

          var feature = new Feature(polygon);

        //   var feature = new Feature({
        //     geometry: new Polygon([latlngs])
        // })

          // polygon.applyTransform(OpenLayers.Projection.getTransform('EPSG:4326', 'EPSG:3857'))

          // polygon.transform('EPSG:4326', 'EPSG:3857');

          const vectorSource1 = new VectorSource({
            features: [feature]
          });
          const vectorLayer1 = new VectorLayer({
            source: vectorSource1,
            style: function(feature) {
              labelStyle.getText().setText(label);
              return styles;
            }
          });
          this.mymap.addLayer(vectorLayer1);


          console.log('drawing polygon ok? ' + polygon.getArea());

          this.mymap.renderSync();


        // const polygon = L.polygon(latlngs).addTo(this.mymap);
        // polygon.bindPopup(descr);

        // const myIcon = L.divIcon({className: 'my-div-icon', html: '<b>' + label + '</b>'});
        // const marker = L.marker([data[0].lat, data[0].lng], {icon: myIcon}).addTo(this.mymap);

        res.push(vectorLayer1);
        // res.push(marker);
      }

    }
    return res;
  }

  updateObject(shps: Geoshape[], show: boolean) {
    try {
      if (show) {
        shps.forEach(shp => {
          shp.obj.forEach(obj => {
            // obj.remove();
            // obj.addTo(this.mymap);
            this.mymap.addLayer(obj);
            // this.map.removeObject(obj);
            // const obj2 = this.map.addObject(obj);
            // this.map.setViewBounds(obj2);
          });
        });
      } else {
        console.log(shps);
        shps.forEach(shp => {
          shp.obj.forEach(obj => {
            // obj.remove();
            this.mymap.removeLayer(obj);
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

    var source = new VectorSource({
      features: this.blockMarkers
    });
    
    var vectorLayer = new VectorLayer({
      source: source
    });
    this.mymap.addLayer(vectorLayer);
  }

  removeBlockNumbers() {
    this.blockMarkers.forEach(blockMarker => {
      blockMarker.remove();
    });

    this.blockMarkers.length = 0;
  }

  drawBlockNum(label, lat, lng) {

    var stroke = new Stroke({color: 'black', width: 2});
    var fill = new Fill({color: 'red'});

    const cross = new Style({
      image: new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: 10,
        radius2: 0,
        angle: 0
      }),
      // image: new Text({
      //   font: '12px Calibri,sans-serif',
      //   overflow: true,
      //   fill: new Fill({
      //     color: '#000'
      //   }),
      //   stroke: new Stroke({
      //     color: '#fff',
      //     width: 3
      //   }),
      //   text: label
      // })
    });

    var labelStyle = new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      }),
      text:  new Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3
        })
      })
    });


    // labelStyle.getText().setText(label);

    const blockMarker =new Feature({
      'geometry': new Point(olProj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
      'i': label
    });

    blockMarker.setStyle(cross);

    this.blockMarkers.push(blockMarker);
  }

}
