import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { SearchCultureService } from '../search-culture.service';
import { MapService, NavtexData, Geoshape } from '../map.service';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { strict } from 'assert';
import { MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';


declare var H: any;
// declare let H;

export class MapLayer {
  name: string;
  kmlFile: string;
  layer: any;
  show: boolean;

  constructor(name, file, layer, show) {
      this.name = name;
      this.kmlFile = file;
      this.layer = layer;
      this.show = show;
  }
}

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
  platform: any;

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
  searchTerm: FormControl = new FormControl();
  searchNavtex: FormControl = new FormControl();

  mapLayers: MapLayer[] = [];
  nvtxs: NavtexData[] = [];

  selectedStation: string;
  stations: string[];

  map: any;
  ui: any;
  behavior: any;
  coordinates = {
    lat: 35.04578,
    lng: 32.96754
    };
  accuracy = 15;


  geocoder: any;

  constructor( private cultureSrv: SearchCultureService
    , public mapSrv: MapService, private dialog: MatDialog) { }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {

    this.stations = this.mapSrv.stations;
    this.selectedStation = this.stations[0];

    this.platform = new H.service.Platform({
      app_id: 'K0Z4rKzWnBk4eR25vS40',
      app_code: 'OEBSCrinYftL-OQPodOiOw',
      useHTTPS: true
    });

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

    this.searchNavtex.valueChanges
    .subscribe(data => {
      const points = this.mapSrv.searchNavtex(data, this.selectedStation);
      this.drawNavtex(points, this.selectedStation, 'navtex');
    });

    const targetElement = document.getElementById('mapContainer');

    // Obtain the default map types from the platform object
    const defaultLayers = this.platform.createDefaultLayers();


    // Instantiate (and display) a map object:
    this.map = new H.Map(
      targetElement,
      defaultLayers.normal.map,
      {
        zoom: 7,
        center: this.coordinates
      });

      this.loadLayer('ΑΟΖ ΚΔ', 'assets/AOZ.kml', true);
      this.loadLayer('Οικόπεδα ΚΔ', 'assets/BLOCKS.kml', true);
      this.loadLayer('ΑΟΖ Ελλάδας', 'assets/MarineRegions-greece-eez.kml', false);
      this.loadLayer('FIR ΚΔ', 'assets/FIR_NEW.kml', false);

      this.drawBlockNumbers(this.map);

      this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
      const distanceMeasurementTool = new H.ui.DistanceMeasurement();
      this.ui.addControl('distancemeasurement', distanceMeasurementTool);
      const mapSettings = this.ui.getControl('mapsettings');
      const zoom = this.ui.getControl('zoom');
      // const scalebar = this.ui.getControl('scalebar');
      const measurement = this.ui.getControl('distancemeasurement');

      mapSettings.setAlignment('top-left');
      zoom.setAlignment('top-left');
      // scalebar.setAlignment('top-left');
      measurement.setAlignment('top-left');

      // this.map.addLayer(defaultLayers.venues);

      this.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

      this.setUpClickListener(this.map);

      window.addEventListener('resize', e => {
        this.map.getViewPort().resize();
      });

      this.mapSrv.searchNavtexDB('')
        .then(response => {
          response.forEach((doc) => {
            const nvtx = this.mapSrv.getFromToken(doc);
            this.nvtxs.push(nvtx);
            // if (nvtx.show) {
              this.drawNavtex2(nvtx);
            // }
          });
      });

  }

  loadLayer(name: string, template: string, show: boolean) {

    const reader = new H.data.kml.Reader(template);
    // Parse the document:
    reader.parse();
    // Get KML layer from the reader object and add it to the map:
    const layer = reader.getLayer();
    if (show) {
      this.map.addLayer(layer);
    }


    this.mapLayers.push(new MapLayer(name, template, layer, show));
  }

  updateLayer(template: string, show: boolean) {
    if (show) {
      this.map.addLayer(template);
    } else {
      this.map.removeLayer(template);
    }
  }

  updateObject(shp: Geoshape, show: boolean) {
    try {
      if (show) {
        this.map.removeObject(shp.obj);
        const obj = this.map.addObject(shp.obj);
          // if (obj instanceof H.map.Polygon) {
            // const polygon = new H.map.Polygon(obj);
            this.map.setViewBounds(obj);
            // this.map.setCenter(shp.points[0]);
            // this.map.setZoom(15);
          // }
      } else {
          this.map.removeObject(shp.obj);
      }
    } catch (error) {
      console.log(error);
    }
  }

  drawNavtex2(nvtx: NavtexData) {

    const area = this.mapSrv.getArea(nvtx);
    const label = nvtx.name + ' Ολική επιφάνεια: ' + (area / 1000000).toFixed(0) + ' τ. χλμ.';

    nvtx.geoshapes.forEach(shape => {
      console.log(shape.type + ' ' + this.mapSrv.shapes[0]);
      if ( shape.type === this.mapSrv.shapes[0]) {
        shape.obj = this.drawNavtex(shape.points, nvtx.station, label);
      }
    });
    nvtx.show = true;
  }

  drawNavtex(data, station, label) {
    if (data.length > 1) {
      // Initialize a linestring and add all the points to it:
      const linestring = new H.geo.LineString();
      data.forEach(function(point) {
        linestring.pushPoint(point);
      });
      linestring.pushPoint(data[0]);

      console.log('station: ' + station);

      let options = {};
      if (station === this.mapSrv.stations[0]) {
        options = {style: { lineWidth: 2, strokeColor: 'red' }, fillColor: 'rgba(35, 51, 129, 0.3)'};
      } else if (station === this.mapSrv.stations[1]) {
        options = {style: { lineWidth: 2, strokeColor: 'yellow', fillColor: 'rgba(35, 51, 129, 0.3)'}};
      }

      // Initialize a polyline with the linestring:
      const polyline = new H.map.Polygon(linestring, options);

      polyline.addEventListener('tap', evt => {
        const bubble =  new H.ui.InfoBubble(data[0], {
          // read custom data
          content: label
        });
        // show info bubble
        this.ui.addBubble(bubble);
    });

      // Add the polyline to the map:
      this.map.addObject(polyline);

      // this.addClickableMarker(label, this.map, data[0]);
      // this.addSVGMarker(label, this.map, data[0]);

      // Zoom the map to make sure the whole polyline is visible:
      // this.map.setViewBounds(polyline.getBounds());
      return polyline;
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
    this.centerMap(event.option.value.locationId);
  }

  private centerMap(locationId: string) {
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
    console.log(resp);
    if (resp !== undefined) {
      resp.forEach(nvtx => {
        console.log(nvtx);
        console.log(nvtx.name + ' - ' + nvtx.show);
        nvtx.geoshapes.forEach(shape => {
          this.updateObject(shape, nvtx.show);
        });
      });
    }

   }

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

  addSVGMarker(label, mapContainer: any, coord: any): void  {

    const svgMarkup = '<svg  width="74" height="20" xmlns="http://www.w3.org/2000/svg">' +
    // '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="18" />' +
    '<text x="31" y="16" font-size="10pt" font-family="Arial" font-weight="bold" ' +
    'text-anchor="middle" fill="${STROKE}" >' + label + '</text></svg>';


    const bearsIcon = new H.map.Icon(
      svgMarkup.replace('${FILL}', 'none').replace('${STROKE}', 'black'));
    const bearsMarker = new H.map.Marker(coord, {icon: bearsIcon});
    const simpleMarker = new H.map.Marker(coord);

    mapContainer.addObject(bearsMarker);
  }

  addClickableMarker(label, mapContainer: any, coord: any): void  {

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
  }

  setUpClickListener(mapContainer) {
    mapContainer.addEventListener('tap', evt => {
      const coord = mapContainer.screenToGeo(evt.currentPointer.viewportX,
              evt.currentPointer.viewportY);
      // const marker = new H.map.Marker(coord);
      // mapContainer.addObject(marker);


      // this.calculateRouteFromAtoB(this.coordinates, coord);
      // this.addSVGMarker(mapContainer, coord);

      // this.addDraggableMarker(mapContainer, this.behavior, coord);

      console.log('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
          ((coord.lat > 0) ? 'N' : 'S') +
          ' ' + Math.abs(coord.lng.toFixed(4)) +
           ((coord.lng > 0) ? 'E' : 'W'));
    });
  }

  drawBlockNumbers(mapContainer) {
    this.addSVGMarker(1, mapContainer, {lat: 34.2764, lng: 32.8192});
    this.addSVGMarker(2, mapContainer, {lat: 34.4137, lng: 33.9234});
    this.addSVGMarker(3, mapContainer, {lat: 34.5948, lng: 34.6155});
    this.addSVGMarker(4, mapContainer, {lat: 33.8682, lng: 30.3967});
    this.addSVGMarker(5, mapContainer, {lat: 33.8682, lng: 30.9241});
    this.addSVGMarker(6, mapContainer, {lat: 33.8682, lng: 31.6162});
    this.addSVGMarker(7, mapContainer, {lat: 33.8682, lng: 32.2644});
    this.addSVGMarker(8, mapContainer, {lat: 33.8682, lng: 32.9456});
    this.addSVGMarker(9, mapContainer, {lat: 33.8682, lng: 33.5498});
    this.addSVGMarker(10, mapContainer, {lat: 33.300, lng: 31.7041});
    this.addSVGMarker(11, mapContainer, {lat: 33.300, lng: 32.2754});
    this.addSVGMarker(12, mapContainer, {lat: 33.300, lng: 32.9785});
    this.addSVGMarker(13, mapContainer, {lat: 33.9867, lng: 34.1321});
  }

  calculateRouteFromAtoB (from, to) {
    const router = this.platform.getRoutingService(),
      routeRequestParams = {
        mode: 'shortest;pedestrian',
        representation: 'display',
        waypoint0: from.lat + ',' + from.lng, // St Paul's Cathedral
        waypoint1: to.lat + ',' + to.lng,  // Tate Modern
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action'
      };
    router.calculateRoute(
      routeRequestParams,
      result => {
        const route = result.response.route[0];
        console.log(route);
       },
      error => {}
    );
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
          const nvtx = result.data;
          this.drawNavtex2(nvtx);
          // this.drawNavtex(result.data.points, result.data.station, result.data.name);

        } else if (result.type === this.mapSrv.LAYER_LIST) {
          if (result.data !== undefined) {
            result.data.forEach(mapL => {
              this.updateLayer(mapL.layer, mapL.show);
              console.log(mapL);
            });
          }
        } else if (result.type === this.mapSrv.NAVTEX_LIST) {
          if (result.data !== undefined) {
            result.data.forEach(nv => {
              if (nv.show) {
                this.drawNavtex(nv.points, nv.station, nv.name);
              }
            });
          }
        }
      }


    });
  }

}

