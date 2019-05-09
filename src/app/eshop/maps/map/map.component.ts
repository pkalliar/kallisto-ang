import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { SearchCultureService } from '../search-culture.service';
import { MapService } from '../map.service';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { strict } from 'assert';
import { MatAutocompleteSelectedEvent } from '@angular/material';

// import '/assets/svg/drama.svg';
// import fileContent from '/assets/svg/drama.svg';

// declare let H;
declare var H: any;

@Component({
  selector: 'app-pk-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

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
  searchTerm: FormControl = new FormControl();
  searchNavtex: FormControl = new FormControl();

  mapTemplate = 'assets/oil_fields.kml';
  aozTemplate = 'assets/AOZ.kml';
  blocksTemplate = 'assets/BLOCKS.kml';

  map: any;
  coordinates = {
    lat: 35.04578, // HERE HQ in Berlin, Germany
    lng: 32.96754
    };
  accuracy = 15;

  geocoder: any;

  constructor( private cultureSrv: SearchCultureService
    , private mapSrv: MapService) { }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {

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
    .pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.mapSrv.searchNavtex(value)
      .pipe(
        finalize(() => this.isLoading = false),
        )
      )
    )
    .subscribe(data => {
      console.log(data);
      if (data.length > 1) {
        // Initialize a linestring and add all the points to it:
        const linestring = new H.geo.LineString();
        data.forEach(function(point) {
          linestring.pushPoint(point);
        });

        // Initialize a polyline with the linestring:
        const polyline = new H.map.Polyline(linestring, { style: { lineWidth: 2 }});

        // Add the polyline to the map:
        this.map.addObject(polyline);

        // Zoom the map to make sure the whole polyline is visible:
        this.map.setViewBounds(polyline.getBounds());
      }

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

      let reader = new H.data.kml.Reader(this.aozTemplate);
      // Parse the document:
      reader.parse();
      // Get KML layer from the reader object and add it to the map:
      let layer = reader.getLayer();
      this.map.addLayer(layer);

      reader = new H.data.kml.Reader(this.blocksTemplate);
      reader.parse();
      layer = reader.getLayer();
      this.map.addLayer(layer);

      const layerd = reader.getParsedObjects();
      console.log(layerd);

      const ui = H.ui.UI.createDefault(this.map, defaultLayers);

      // this.map.addLayer(defaultLayers.venues);

      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

      this.setUpClickListener(this.map);

      window.addEventListener('resize', e => {
        this.map.getViewPort().resize();
      });

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

  addSVGMarker(mapContainer: any, coord: any): void  {



    const svgMarkup = '<svg  width="54" height="24" xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="black" fill="${FILL}" x="1" y="1" width="52" height="22" />' +
    '<text x="26" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
    'text-anchor="middle" fill="${STROKE}" >' + 'lakis' + '</text></svg>';

    const bearsIcon = new H.map.Icon(
      svgMarkup.replace('${FILL}', 'blue').replace('${STROKE}', 'red')),
      bearsMarker = new H.map.Marker(coord, {icon: bearsIcon});

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
      console.log('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
          ((coord.lat > 0) ? 'N' : 'S') +
          ' ' + Math.abs(coord.lng.toFixed(4)) +
           ((coord.lng > 0) ? 'E' : 'W'));
    });
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



}
