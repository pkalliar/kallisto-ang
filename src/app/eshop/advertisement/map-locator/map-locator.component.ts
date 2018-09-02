import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {PhotoAlbum} from '../photo-album.service';
import {Photo} from '../photo';
declare let L;

@Component({
    selector: 'app-map-locator',
    templateUrl: 'map-locator.component.html',
    styleUrls: ['map-locator.component.css']
})
export class MapLocatorComponent implements OnInit {

    public publicId = '';
    map: any;

    @Output() positioned = new EventEmitter<Object>();


    constructor(
        private photoAlbum: PhotoAlbum
    ) { }

    ngOnInit(): void {


    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {

        let marker = null;

        this.map = L.map('map').setView([38.0152, 23.8277], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

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
