import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { SearchCultureService } from '../search-culture.service';
import { MapService } from '../map.service';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { strict } from 'assert';

declare let H;

@Component({
  selector: 'app-pk-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  locOptions: string[] = [];
  filteredOptions: string[];
  isLoading = false;

   options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  watchID: any;

  searchTerm: FormControl = new FormControl();

  map: any;
  coordinates = {
    lat: 52.530974, // HERE HQ in Berlin, Germany
    lng: 13.384944
    };
  accuracy = 15;

  // Create the parameters for the geocoding request:
  geocodingParams = {
    searchText: '200 S Mathilda Ave, Sunnyvale, CA'
  };
  geocoder: any;


  constructor( private cultureSrv: SearchCultureService
    , private mapSrv: MapService) { }

  handleKeyPress(e) {
    const key = e.keyCode || e.which;
      // if (this.searchTerm.value != null && this.searchTerm.value.length > 2) {
        // console.log(' looking for ' + this.searchTerm.value);

      // }
      if (key === 1399999 ) {
        console.log(' enter pressed ' + this.searchTerm.value);
        navigator.geolocation.clearWatch(this.watchID);
        this.geocoder.geocode({
          searchText: this.searchTerm.value
        }, result => {
        console.log(JSON.stringify(result.Response));
        const locations = result.Response.View[0].Result;
        // Add a marker for each location found
        for (let i = 0;  i < locations.length; i++) {
          const position = {
          lat: locations[i].Location.DisplayPosition.Latitude,
          lng: locations[i].Location.DisplayPosition.Longitude
        };
        const marker = new H.map.Marker(position);
        this.map.addObject(marker);

        this.map.setCenter(position);

        }
      }, error => {
        alert(error);
      });

      }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {

    const platform = new H.service.Platform({
      app_id: 'K0Z4rKzWnBk4eR25vS40',
      app_code: 'OEBSCrinYftL-OQPodOiOw'
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


    // this.searchTerm.valueChanges
    // .pipe(
    //   debounceTime(300),
    //   tap(() => this.isLoading = true),
    //   switchMap(value => {
    //     console.log('value ' + value);
    //     // return value;
    //     return this.geocoder.geocode({
    //       searchText: value
    //     }, result => {
    //       if (result.Response.View.length > 0) {
    //         for (let c = 0;  c < result.Response.View.length; c++) {
    //           const locations = result.Response.View[c].Result;
    //           console.log(locations);
    //           // Add a marker for each location found
    //           for (let i = 0;  i < locations.length; i++) {
    //             console.log('found: ' + JSON.stringify(locations[i].Location.Address));
    //             this.locOptions.push(locations[i].Location.Address.Label);
    //             //   const position = {
    //             //   lat: locations[i].Location.DisplayPosition.Latitude,
    //             //   lng: locations[i].Location.DisplayPosition.Longitude
    //             // };
    //           }
    //         }
    //       }
    //     }, error => {
    //       alert(error);
    //     }).subscribe(points =>  {
    //       console.log(points);
    //       this.isLoading = false;
    //     }); }
    // ));

    const targetElement = document.getElementById('mapContainer');

    // Obtain the default map types from the platform object
    const defaultLayers = platform.createDefaultLayers();

    // this.watchID = navigator.geolocation.watchPosition(
    //   pos => {
    //       this.coordinates.lat = pos.coords.latitude;
    //       this.coordinates.lng = pos.coords.longitude;
    //       this.accuracy = pos.coords.accuracy;


    //       // console.log('Your current position is:');
    //       // console.log(`Latitude : ${this.coordinates.lat}`);
    //       // console.log(`Longitude: ${this.coordinates.lng}`);
    //       // console.log(`More or less ${this.accuracy} meters.`);


    //       // this.map.setView([this.latitude, this.longitude], 15);

    //       this.map.setCenter(this.coordinates);
    //       this.map.setZoom(14);



    //       const marker = new H.map.Marker(this.coordinates);
    //       this.map.addObject(marker);
    //   }
    // , err => {
    //   console.warn(`ERROR(${err.code}): ${err.message}`);
    // }, this.options);

      // Instantiate (and display) a map object:
      this.map = new H.Map(
        targetElement,
        defaultLayers.normal.map,
        {
          zoom: 10,
          center: this.coordinates
        });

        const ui = H.ui.UI.createDefault(this.map, defaultLayers);

        // Add the venue layer to the map:
        // this.map.addLayer(maptypes.venues);






        // const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

        // const ui = H.ui.UI.createDefault(this.map, maptypes);

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
      console.log(JSON.stringify(res));
      return str;
      // return str + res['address']['postalCode'];
    }
  }

  private _filter(value: string): Observable<string[]> {
    const filterValue = value.toLowerCase();
    console.log('casc' + filterValue);
    this.locOptions = [];
    return this.geocoder.geocode({
      searchText: filterValue
    }, result => {
      if (result.Response.View.length > 0) {
        for (let c = 0;  c < result.Response.View.length; c++) {
          const locations = result.Response.View[c].Result;
          console.log(locations);
          // Add a marker for each location found
          for (let i = 0;  i < locations.length; i++) {
            console.log('found: ' + JSON.stringify(locations[i].Location.Address));
            this.locOptions.push(locations[i].Location.Address.Label);
              const position = {
              lat: locations[i].Location.DisplayPosition.Latitude,
              lng: locations[i].Location.DisplayPosition.Longitude
            };
          }
        }

      }
    }, error => {
      alert(error);
    });

    // return this.locOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
