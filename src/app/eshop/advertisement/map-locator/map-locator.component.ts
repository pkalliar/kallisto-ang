import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {PhotoAlbum} from '../photo-album.service';
import {Photo} from '../photo';
import {Geometry} from '../advertisement';
declare let L;

@Component({
    selector: 'app-map-locator',
    templateUrl: 'map-locator.component.html',
    styleUrls: ['map-locator.component.css']
})
export class MapLocatorComponent implements OnInit {

    public publicId = '';
    map: any;

    @Input()
    geometry: Geometry = null;

    @Output() positioned = new EventEmitter<Object>();


    constructor(
        private photoAlbum: PhotoAlbum
    ) { }

    ngOnInit(): void {



    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {

        let marker = null;

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };

          this.map = L.map('map');

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
        }).addTo(this.map);

        // this.map = L.map('map').setView([38.0152, 23.8277], 13);



        L.tileLayer.provider('HERE.terrainDay', {
            app_id: 'K0Z4rKzWnBk4eR25vS40',
            app_code: 'OEBSCrinYftL-OQPodOiOw'
        }).addTo(this.map);

        if (this.geometry !== null) {
            console.log(JSON.stringify(this.geometry));
            if (marker == null) {
                marker = L.marker([this.geometry.coordinates[1], this.geometry.coordinates[0]], {draggable: false}).addTo(this.map);
                this.map.setView([this.geometry.coordinates[1], this.geometry.coordinates[0]], 15);
            }
        } else {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const crd = pos.coords;

                    console.log('Your current position is:');
                    console.log(`Latitude : ${crd.latitude}`);
                    console.log(`Longitude: ${crd.longitude}`);
                    console.log(`More or less ${crd.accuracy} meters.`);

                    this.map.setView([crd.latitude, crd.longitude], 15);
                }
              , err => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
              }, options);
        }

        this.map.on('click', e => {
            // console.log('You clicked the map at ' + e.latlng.lat);
            if (marker == null) {
                marker = L.marker([e.latlng.lat, e.latlng.lng], {draggable: true}).addTo(this.map);

                this.positioned.emit(marker.toGeoJSON().geometry);
            }



            marker.on('click', e2 => {
                // console.log('You clicked the marker at ' + e2.latlng.lat);
            });
            marker.on('moveend', e3 => {
                console.log('You dragged the marker at ' + marker.getLatLng());
                console.log('You dragged the marker at ' + JSON.stringify(marker.toGeoJSON()));

                this.positioned.emit(marker.toGeoJSON().geometry);
            });
        });

        // const marker = L.marker([38.015573, 23.822618]).addTo(this.map);

    }



}
