import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { SearchCultureService } from '../search-culture.service';
import { MapService } from '../map.service';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { strict } from 'assert';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { NavtexData, Geoshape, NavtexStation, MapLayer } from '../navtex-data';
import { TopnavService } from '../../../topnav/topnav.service';
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';


declare var H: any;
// import H from 'heremaps';
// declare let H;


@Component({
  selector: 'app-pk-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // csv = require('fast-csv');

  locOptions: string[] = [];
  // filteredOptions: string[];
  isLoading = false;
  suggestion: Object;
  // platform: any;

   options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  watchID: any;

  showsearch: boolean;
  showNavtexSearch: boolean;
  showNvtxList: boolean;
  showNvtxDetail: boolean;
  showLayerList: boolean;
  searchTerm: FormControl = new FormControl();
  searchPoint: FormControl = new FormControl();

  mapLayers: MapLayer[] = [];
  nvtxs: NavtexData[] = [];
  selectedNavtex: NavtexData = null; // new NavtexData();

  selectedStation: NavtexStation;
  stations: NavtexStation[];
  blockMarkers: any[] = [];

  map: any;
  ui: any;
  behavior: any;
  @Input() coordinates = {
    lat: 34.04578,
    lng: 29.46754
    };
  accuracy = 18;


  geocoder: any;

  constructor( public mapSrv: MapService, private dialog: MatDialog) { }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {

    this.stations = this.mapSrv.stations;
    this.selectedStation = this.stations[0];

    this.searchTerm
    .valueChanges
    .pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.mapSrv.search(value)
      .pipe(
        finalize(() => this.isLoading = false),
        )
      )
    )
    .subscribe(data => {
      this.locOptions = data['suggestions'];
    });

    this.searchPoint.valueChanges
    .subscribe(data => {
      const point = this.mapSrv.parseCoordLine(data);
      console.log(point);
      this.map.setCenter(point);
      this.map.setZoom(15);
      const marker = new H.map.Marker(point);
      this.map.addObject(marker);
    });

    const targetElement = document.getElementById('mapContainer');

    // Obtain the default map types from the platform object
    const defaultLayers = this.mapSrv.platform.createDefaultLayers();


    // Instantiate (and display) a map object:
    this.map = new H.Map(
      targetElement,
      defaultLayers.normal.map,
      {
        zoom: 7,
        center: this.coordinates
      });

      // this.loadLayer('ΑΟΖ ΚΔ', 'assets/maps/Cyprus_AOZ.kml', true);
      // // this.loadLayer('ΑΟΖ ΚΔ', 'assets/maps/MarineRegions-cyprus-eez.kml', true);
      // this.loadLayer('Οικόπεδα ΚΔ', 'assets/maps/BLOCKS.kml', true);
      // this.loadLayer('Χωρικά ύδατα 12ΝΜ ΚΔ', 'assets/maps/cyprus-MarineRegions-eez_12nm.kml', true);
      // // this.loadLayer('12ΝΜ Ελλάδας', 'assets/maps/MarineRegions-greece-eez_12nm.kml', false);
      // // this.loadLayer('ΑΟΖ Ελλάδας', 'assets/maps/MarineRegions-greece-eez.kml', false);
      // this.loadLayer('FIR ΚΔ', 'assets/maps/Cyprus_FIR.kml', false);
      // this.loadLayer('ΔΙΕΚΔΙΚΗΣΕΙΣ ΤΟΥΡΚΙΑΣ', 'assets/maps/Turkey_EEZ_claims.kml', true);
      // this.loadLayer('ΑΚΤΟΓΡΑΜΜΗ ΒΑΣΗΣ ΥΠΟΛΟΓΙΣΜΟΥ ΑΟΖ ΤΟΥΡΚΙΑΣ', 'assets/maps/Turkey_EEZ_coasts.kml', false);

      // this.drawBlockNumbers();

      this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
      const distanceMeasurementTool = new H.ui.DistanceMeasurement();
      this.ui.addControl('distancemeasurement', distanceMeasurementTool);
      // const mapSettings = this.ui.getControl('mapsettings');
      const zoom = this.ui.getControl('zoom');
      // const scalebar = this.ui.getControl('scalebar');
      const measurement = this.ui.getControl('distancemeasurement');

      // mapSettings.setAlignment('top-left');
      // zoom.setAlignment('top-left');
      // scalebar.setAlignment('top-left');
      // measurement.setAlignment('top-left');

      // this.map.addLayer(defaultLayers.venues);

      this.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

      this.setUpClickListener(this.map);

      window.addEventListener('resize', e => {
        this.map.getViewPort().resize();
      });

      // this.mapSrv.searchNavtexDB('')
      //   .then(response => {
      //     response.forEach((doc) => {
      //       const nvtx = this.mapSrv.getFromToken(doc);
      //       this.nvtxs.push(nvtx);
      //       // if (nvtx.show) {
      //         this.drawNavtex2(nvtx);
      //       // }
      //     });
      // });

  }

  @Input() drawLayer(layer: MapLayer) {
    // console.log(layer);
    let exists = false;
    this.mapLayers.forEach(l => {
      // console.log(l);
      if (l.kmlFile === layer.kmlFile && l.layer) {
        exists = true;
        if ( layer.show === true ) {
          this.map.addLayer(l.layer);
          if (layer.kmlFile === 'BLOCKS.kml') {
            this.drawBlockNumbers();
          }
        } else {
          this.map.removeLayer(l.layer);
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

      const reader = new H.data.kml.Reader('assets/maps/' + layer.kmlFile);
      // Parse the document:
      reader.parse();
      layer.layer = reader.getLayer();



      this.mapLayers.push(layer);
      this.map.addLayer(layer.layer);

      // console.log(layer.layer.getData());
      // objs.forEach(shp => {
      //   console.log(shp);
      // });
      if (layer.kmlFile === 'BLOCKS.kml') {
        this.drawBlockNumbers();
      }
    }

  }


  updateObject(shps: Geoshape[], show: boolean) {
    try {
      if (show) {
        shps.forEach(shp => {
          shp.obj.forEach(obj => {
            this.map.removeObject(obj);
            const obj2 = this.map.addObject(obj);
            this.map.setViewBounds(obj2);
          });

        });

          // if (obj instanceof H.map.Polygon) {
            // const polygon = new H.map.Polygon(obj);
            // this.map.setCenter(shp.points[0]);
            // this.map.setZoom(15);
          // }
      } else {
        console.log(shps);
        shps.forEach(shp => {
          shp.obj.forEach(obj => {
            this.map.removeObject(obj);
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  drawNavtex2(nvtx: NavtexData) {

    const area = this.mapSrv.getArea(nvtx);
    const descr = nvtx.name + ' Ολική επιφάνεια: ' + (area / 1000000).toFixed(0) + ' τ. χλμ.';

    nvtx.geoshapes.forEach(shape => {
      console.log(shape.type + ' ' + this.mapSrv.shapes[0]);
      // if ( shape.type === this.mapSrv.shapes[0]) {
        shape.obj = this.drawNavtex(shape.points, nvtx.station_name, nvtx.name, shape.type, descr);
      // }
    });
    nvtx.show = true;
    return nvtx;
  }

  drawNavtex(data, station, label, type, descr) {
    if (data.length > 1) {

      const shapes: Geoshape[]  = [];
      let options = {};
      if (station === this.stations[0] || station === this.stations[2] || station === this.stations[3]) {
        options = {style: { lineWidth: 2, strokeColor: 'red' }, fillColor: 'rgba(35, 51, 129, 0.3)'};
      } else if (station === this.stations[1]) {
        options = {style: { lineWidth: 2, strokeColor: 'yellow', fillColor: 'rgba(35, 51, 129, 0.3)'}};
      }

      if ( type === this.mapSrv.shapes[0]) {
        const linestring = new H.geo.LineString();
        data.forEach(function(point) {
          linestring.pushPoint(point);
        });
        linestring.pushPoint(data[0]);
        const mymarker = this.addSVGLabelMarker(label, this.map, data[0]);
        shapes.push(mymarker);

              // Initialize a polyline with the linestring:
        const polyline = new H.map.Polygon(linestring, options);

        polyline.addEventListener('tap', evt => {
            const bubble =  new H.ui.InfoBubble(data[0], {
              // read custom data
              content: descr
            });
            // show info bubble
            this.ui.addBubble(bubble);
        });

        // Add the polyline to the map:
        this.map.addObject(polyline);
        shapes.push(polyline);
      }
      if ( type === this.mapSrv.shapes[2]) {
        // let marker;
        data.forEach(point => {
          const mymarker = new H.map.Marker(point);
          this.map.addObject(mymarker);
          shapes.push(mymarker);
          // this.addClickableMarker(label, this.map, point);
        });
      }

      return shapes;


      // this.addClickableMarker(label, this.map, data[0]);
      // this.addSVGMarker(label, this.map, data[0]);

      // Zoom the map to make sure the whole polyline is visible:
      // this.map.setViewBounds(polyline.getBounds());

    }
  }



  displayFn(res?: Object): string | undefined {
    if ((res === null) || (res === '')) {
      return undefined;
    } else {
      let str = res['label'].toString();
      str = str.replace(/<[^>]*>/g, '');
      this.suggestion = res;
      console.log(JSON.stringify(res));
      return str;
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.suggestion = event.option.value;
    console.log(event.option.value);
    this.centerMap2(event.option.value.locationId);
  }

  @Input() centerMap(lat: number, lng: number) {
    const myCenter = {lat: lat, lng: lng};

    this.map.setCenter(myCenter);
  }

  private centerMap2(locationId: string) {
    this.mapSrv.getCoordinates(locationId)
    .subscribe(data => {
      console.log(data.response.view[0].result[0].location.mapView);

      const mapview = data.response.view[0].result[0].location.mapView;

      const bbox = new H.geo.Rect(
        mapview.topLeft.latitude,
        mapview.topLeft.longitude,
        mapview.bottomRight.latitude,
        mapview.bottomRight.longitude
      );
      this.map.setViewBounds(bbox);
    });

  }

  onNavtexSelection(resp: any) {
    let found  = false;
    for (let i = 0; i < this.nvtxs.length; i++) {
      if (this.nvtxs[i].id === resp.id) {
        found = true;
        if (!resp.show) {
          this.nvtxs.splice(i, 1);
          this.updateObject(resp.geoshapes, resp.show);
          // resp.geoshapes.forEach(shape => {
          //  this.updateObject(shape, resp.show);
          // });
        }
      }
    }
    if (!found) {
      const nvtx2 = this.drawNavtex2(resp);
      this.nvtxs.push(nvtx2);
    }
  }

  @Input() onNavtexFocus(resp: any) {
    this.nvtxs.forEach(nvtx => {
      if (nvtx.id === resp.id) {
        this.map.setViewBounds(nvtx.geoshapes[0].obj[0].getBounds());
      }
    });
  }

  onNavtexDetail(resp: any) {
    console.log(resp);
    this.selectedNavtex = resp;
    // this.showNvtxDetail = true;
    this.openDialog(this.mapSrv.NAVTEX_DETAIL, resp);
  }

  onPositioned(resp: any) {
    console.log(resp);
    this.drawNavtex2(resp);
   }

  // onLayerSelected(resp: any) {
  //   console.log(resp);
  //   this.updateLayer(resp.layer, resp.show, resp.name);
  //  }

  myLocation() {
    this.watchID = navigator.geolocation.getCurrentPosition(
      pos => {
          this.coordinates.lat = pos.coords.latitude;
          this.coordinates.lng = pos.coords.longitude;
          this.accuracy = pos.coords.accuracy;

          this.map.setCenter(this.coordinates);
          this.map.setZoom(15);

          const marker = new H.map.Marker(this.coordinates);
          this.map.addObject(marker);
      }
    , err => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }, this.options);
  }



  addSVGBlockMarker(label, mapContainer: any, coord: any): void  {

    const svgMarkup = '<svg  width="74" height="20" xmlns="http://www.w3.org/2000/svg">' +
    // '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="18" />' +
    '<text x="31" y="16" font-size="10pt" font-family="Arial" font-weight="bold" ' +
    'text-anchor="middle" fill="${STROKE}" >' + label + '</text></svg>';

    const bearsIcon = new H.map.Icon(
      svgMarkup.replace('${FILL}', 'none').replace('${STROKE}', 'black'));
    const blockMarker = new H.map.Marker(coord, {icon: bearsIcon});
    // const simpleMarker = new H.map.Marker(coord);

    mapContainer.addObject(blockMarker);
    this.blockMarkers.push(blockMarker);
  }

  delay = ms => new Promise(res => setTimeout(res, ms));

  @Input() async snapshot() {
    console.log('printing..');

    const logo = await this.addOverlayToMap(this.map, '');

    console.log('added logo..');

    await this.delay(1000);
    console.log('Waited 1s');


    this.map.capture(canvas => {
      if (canvas) {
          canvas.toBlob(function(blob) {
            saveAs(blob, 'navtex-map.jpg');
        });
        this.map.removeObject(logo);
      } else {
        // For example when map is in Panorama mode
        console.log('Capturing is not supported');
      }
    }, [this.ui]);
  }

  async addOverlayToMap(mapContainer: any, image: string) {

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'assets/gremb_nic100.png';

    console.log('adding image');

    // create an overlay that will use a weather map as a bitmap
    const overlay = await new H.map.Overlay(
      new H.geo.Rect(
        mapContainer.screenToGeo(2, 2).lat, mapContainer.screenToGeo(2, 2).lng,
        mapContainer.screenToGeo(102, 102).lat, mapContainer.screenToGeo(102, 102).lng
      ),
      img,
      {
        // the bitmap is frequently updated mark the object as volatile
        volatility: false
      }
    );

    // add overlay to the map
    await mapContainer.addObject(overlay);
    return overlay;
  }



  addSVGLabelMarker(label, mapContainer: any, coord: any): Geoshape {

    const svgMarkup = '<svg  width="74" height="20" xmlns="http://www.w3.org/2000/svg">' +
    // '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="18" />' +
    '<text x="31" y="16" font-size="10pt" font-family="Arial" font-weight="bold" ' +
    'text-anchor="middle" fill="${STROKE}" >' + label + '</text></svg>';

    const bearsIcon = new H.map.Icon(
      svgMarkup.replace('${FILL}', 'none').replace('${STROKE}', 'black'));
    const blockMarker = new H.map.Marker(coord, {icon: bearsIcon});
    // const simpleMarker = new H.map.Marker(coord);

    mapContainer.addObject(blockMarker);
    this.blockMarkers.push(blockMarker);
    return blockMarker;
  }

  addClickableMarker(label, mapContainer: any, coord: any): Geoshape  {

    const domElement = document.createElement('div');
    domElement.textContent = label;
    domElement.style.fontSize = 'small';
    domElement.style.width = '50px';
    domElement.style.height = '20px';
    // domElement.style.backgroundColor = 'blue';

    const domIcon = new H.map.DomIcon(domElement);

    const simpleMarker = new H.map.Marker(coord);
    const bearsMarker = new H.map.DomMarker(coord, {
      icon: domIcon
    });

    mapContainer.addObject(bearsMarker);
    return bearsMarker;
  }

  setUpClickListener(mapContainer) {
    mapContainer.addEventListener('dbltap', evt => {
      const coord = mapContainer.screenToGeo(evt.currentPointer.viewportX,
              evt.currentPointer.viewportY);
      // const marker = new H.map.Marker(coord);
      // mapContainer.addObject(marker);


      // this.calculateRouteFromAtoB(this.coordinates, coord);
      // this.addSVGMarker(mapContainer, coord);

      // this.addDraggableMarker(mapContainer, this.behavior, coord);

      const posStr = Math.abs(coord.lat.toFixed(4)) +
      ((coord.lat > 0) ? 'N' : 'S') +
      ' ' + Math.abs(coord.lng.toFixed(4)) +
       ((coord.lng > 0) ? 'E' : 'W');

       console.log(mapContainer.getCenter());
       console.log(mapContainer.screenToGeo(2, 2));


      console.log('Clicked at ' + posStr);


        const bubble = new H.ui.InfoBubble({ lng: coord.lng, lat: coord.lat }, {
            content: '<b>' + posStr + '</b>'
         });

        this.ui.addBubble(bubble);
    });
  }

  drawBlockNumbers() {

    this.addSVGBlockMarker(1, this.map, {lat: 34.2764, lng: 32.8192});
    this.addSVGBlockMarker(2, this.map, {lat: 34.4137, lng: 33.9234});
    this.addSVGBlockMarker(3, this.map, {lat: 34.5948, lng: 34.6155});
    this.addSVGBlockMarker(4, this.map, {lat: 33.8682, lng: 30.3967});
    this.addSVGBlockMarker(5, this.map, {lat: 33.8682, lng: 30.9241});
    this.addSVGBlockMarker(6, this.map, {lat: 33.8682, lng: 31.6162});
    this.addSVGBlockMarker(7, this.map, {lat: 33.8682, lng: 32.2644});
    this.addSVGBlockMarker(8, this.map, {lat: 33.8682, lng: 32.9456});
    this.addSVGBlockMarker(9, this.map, {lat: 33.8682, lng: 33.5498});
    this.addSVGBlockMarker(10, this.map, {lat: 33.300, lng: 31.7041});
    this.addSVGBlockMarker(11, this.map, {lat: 33.300, lng: 32.2754});
    this.addSVGBlockMarker(12, this.map, {lat: 33.300, lng: 32.9785});
    this.addSVGBlockMarker(13, this.map, {lat: 33.9867, lng: 34.1321});
  }

  removeBlockNumbers() {
    this.blockMarkers.forEach(blockMarker => {
      this.map.removeObject(blockMarker);
    });

    this.blockMarkers.length = 0;
  }



  openDialog(type: number, data: any): void {
    const dialogRef = this.dialog.open(MapDialogComponent, {
      height: '600px',
      width: '600px',
      data: {
        type: type,
        data: data
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        if (result.type === this.mapSrv.NAVTEX_DETAIL) {
          if (result.data !== null) {
            this.selectedNavtex = result.data;
            this.drawNavtex2(this.selectedNavtex);
            this.map.setViewBounds(this.selectedNavtex.geoshapes[0].obj[0].getBounds());
          } else {
            console.log(this.selectedNavtex);
            this.updateObject(this.selectedNavtex.geoshapes, false);
            // this.selectedNavtex.geoshapes.forEach(shape => {
            //  });
             this.selectedNavtex = null;
            this.openDialog(this.mapSrv.NAVTEX_DETAIL, this.selectedNavtex);
          }
          // this.drawNavtex(result.data.points, result.data.station, result.data.name);
        } else if (result.type === this.mapSrv.LAYER_LIST) {
          if (result.data !== undefined) {
            result.data.forEach(mapL => {
              // this.updateLayer(mapL.layer, mapL.show, mapL.name);
              console.log(mapL);
            });
          }
        } else if (result.type === this.mapSrv.NAVTEX_LIST) {
          if (result.data !== undefined) {
            result.data.forEach(nv => {
              if (nv.show) {
                this.drawNavtex(nv.points, nv.station, nv.name, nv.type, nv.name);
              }
            });
          }
        }
      }


    });
  }

}

