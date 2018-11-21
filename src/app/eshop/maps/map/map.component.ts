import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

declare let H;

@Component({
  selector: 'pk-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

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


  constructor() { }

  handleKeyPress(e) {
    const key = e.keyCode || e.which;
      if (key === 13 ) {
      console.log(' enter pressed ' + this.searchTerm.value);
      navigator.geolocation.clearWatch(this.watchID);


      }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {

    const platform = new H.service.Platform({
      app_id: 'K0Z4rKzWnBk4eR25vS40',
      app_code: 'OEBSCrinYftL-OQPodOiOw'
    });

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


        // Get an instance of the geocoding service:
      const geocoder = platform.getGeocodingService();

      // Call the geocode method with the geocoding parameters,
      // the callback and an error callback function (called if a
      // communication error occurs):
      geocoder.geocode(this.geocodingParams, result => {
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

        // const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

        // const ui = H.ui.UI.createDefault(this.map, maptypes);

        window.addEventListener('resize', e => {
          this.map.getViewPort().resize();
        });

  }

}
