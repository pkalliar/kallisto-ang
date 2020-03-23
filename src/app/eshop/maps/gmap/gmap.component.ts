import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-pk-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements AfterViewInit {
  name = 'Angular 5';
  coordinates = {
    lat: 35.04578, // HERE HQ in Berlin, Germany
    lng: 32.96754
    };
  mapTemplate = 'https://drive.google.com/file/d/1wMPfCTjun-1Lrlw2jod6Uz-8G0DfOGFl/view?usp=sharing';
  uluru: Object = { lat: -25.363, lng: 131.044 };
  map: any;
  src = 'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';
  marker: Object;
  zoom: number;
  @ViewChild('map') mapRef: ElementRef;

  ngAfterViewInit() {
    // used setTimeout google map is delayed in loading, in stackBlitz

    setTimeout(() => {
      this.map = new google.maps.Map(this.mapRef.nativeElement, {
        zoom: 8,
        center: this.coordinates
        // center: new google.maps.LatLng(-19.257753, 146.823688),
      });
      // this.marker = new google.maps.Marker({
      //   position: this.coordinates,
      //   map: this.map
      // });

      const ctaLayer = new google.maps.KmlLayer(this.mapTemplate, {
        // url: this.mapTemplate,
        suppressInfoWindows: true,
        map: this.map
      });

    }, 5000);

    // console.log(this.map.getZoom())
  }
  reset() {
    this.uluru = { lat: -25.363, lng: 131.044 };
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      zoom: 4,
      center: this.uluru
    });
    this.marker = new google.maps.Marker({
      position: this.uluru,
      map: this.map
    });
  }
  updateMap(lats: number, lon: number) {
    this.zoom = this.map.getZoom();
    alert('current zoom=' + this.zoom);
    this.uluru = { lat: lats, lng: lon };
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      zoom: this.zoom,
      center: this.uluru
    });
    this.marker = new google.maps.Marker({
      position: this.uluru,
      map: this.map
    });
  }
}
