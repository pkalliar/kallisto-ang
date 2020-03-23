import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MapService } from '../map.service';
import { NavtexStation, NavtexData, MapLayer } from '../navtex-data';
import { NavtexListComponent } from '../navtex-list/navtex-list.component';
import { HeremapComponent } from '../heremap/heremap.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { TopnavService } from '../../../topnav/topnav.service';
import { LeafmapComponent } from '../leafmap/leafmap.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { OpenLayersMapComponent } from '../open-layers-map/open-layers-map.component';



@Component({
  selector: 'pk-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  mobileQuery: MediaQueryList;
  panel = 2;

  stations: NavtexStation[];
  showStations = true;
  // private navList: NavtexListComponent;
  @ViewChild(NavtexListComponent) navList: NavtexListComponent;
  @ViewChild(HeremapComponent) heremap: HeremapComponent;
  @ViewChild(LeafmapComponent) leafletmap: LeafmapComponent;
  @ViewChild(OpenLayersMapComponent) olmap: OpenLayersMapComponent;

  navtexData: NavtexData;

  maps: any[] = [
    {name: 'HERE Maps', show: true},
    {name: 'Leaflet-Mapbox', show: false},
    {name: 'OpenLayers', show: false}];
  selectedMap = this.maps[0];
  initial_coords = null;
  mapLayers: MapLayer[] = [];
  hide2Print = false;

  constructor(private mapSrv: MapService, private authService: AuthService,
    private topnav: TopnavService, private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private dialog: MatDialog) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit() {

    this.topnav.setTitle('Kallisto');

    this.mapSrv.getNavtexStations().then(stations => {

      this.authService.user.subscribe(
        (user) => {
          if (user) {
            this.mapSrv.searchStationsForUser(user)
            .then( mystations => {
              console.log(mystations);
              this.stations = stations.map(station => {
                if (mystations.indexOf(station.id) >= 0) {
                  station.show = true;
                } else {
                  station.show = false;
                }
                return station;
              });
              console.log(this.stations);
              this.navList.testFunction(mystations);
            });

            this.mapSrv.getInitCoordsForUser(user)
            .then( res => {
              this.initial_coords = res;
              console.log(this.initial_coords);
              if (this.maps[0].show) {
                this.heremap.centerMap(this.initial_coords['lat'], this.initial_coords['lng']);
              }
              if (this.maps[1].show) {
                this.leafletmap.centerMap(this.initial_coords['lat'], this.initial_coords['lng']);
              }
              if (this.maps[2].show) {
                this.olmap.centerMap(this.initial_coords['lat'], this.initial_coords['lng']);
              }
            });

            this.mapSrv.getVisibleLayersForUser(user)
            .then( layers => {
              console.log(layers);
              // console.log(layers.length);
              this.mapLayers = layers;
              for (let index = 0; index < layers.length; index++) {
                // console.log(layers[index]);
                if(layers[index].show) {
                  if (this.maps[0].show) {
                    this.heremap.drawLayer(layers[index]);
                  }
                  if (this.maps[1].show) {
                    this.leafletmap.drawLayer(layers[index]);
                  }
                  if (this.maps[2].show) {
                    this.olmap.drawLayer(layers[index]);
                  }
                }

              }

              // this.mapSrv.getVisibleLayersForUser(user);

              // if (this.maps[2].show) {
              //   this.olmap.drawGeoJson();
              // }
              // layers.forEach(layer => {
              //   console.log(layer);
              //   if (this.selectedMap === this.maps[1]) {
              //     this.leafletmap.drawLayer(layer);
              //   }
              // });

            });

          }
      });
    });
  }

  drawLayers() {
    this.mapLayers.forEach(layer => {
      if (this.maps[0].show) {
        this.heremap.drawLayer(layer);
      }
      if (this.maps[1].show) {
        this.leafletmap.drawLayer(layer);
      }
      if (this.maps[2].show) {
        this.olmap.drawLayer(layer);
      }
    });
  }

  snapshot() {
    if (this.maps[0].show) {
      this.heremap.snapshot();
    } else if (this.maps[1].show) {
      this.hide2Print = true;
      this.leafletmap.snapshot();
      this.hide2Print = false;
    } else if (this.maps[2].show) {
      this.olmap.snapshot();
    }
  }

  stationsChanged() {
    const selectedStations = [];
    this.stations.map(station => {
      // console.log(station.name + ' - ' + station.show);
      if (station.show) {
        selectedStations.push(station.id);
      }
    });
    this.navList.testFunction(selectedStations);
  }

  onNavtexSelection(resp: any) {
    if (this.maps[0].show) {
      this.heremap.onNavtexSelection(resp);
    } else if (this.maps[1].show) {
      this.leafletmap.onNavtexSelection(resp);
    } else if (this.maps[2].show) {
      this.olmap.onNavtexSelection(resp);
    }
  }

  onNavtexFocus(resp: any) {
    if (this.maps[0].show) {
      this.heremap.onNavtexFocus(resp);
    }
    if (this.maps[1].show) {
      this.leafletmap.onNavtexFocus(resp);
    }
  }

  onNavtexDetail(resp: any) {
    if (this.maps[0].show) {
      this.heremap.onNavtexDetail(resp);
    }
    if (this.maps[1].show) {
      this.openDialog(this.mapSrv.NAVTEX_DETAIL, resp);
    }
  }

  onLayerSelected(resp: any) {
    console.log(resp);
    if (this.maps[0].show) {
      this.heremap.drawLayer(resp);
    }
    if (this.maps[1].show) {
      this.leafletmap.drawLayer(resp);
    }
  }

  mapChanged() {
    console.log(this.selectedMap);
    if(this.selectedMap === this.maps[0]) {
      this.maps[0].show = true;
      this.maps[1].show = false;
      this.maps[2].show = false;
    }else if(this.selectedMap === this.maps[1]) {
      this.maps[0].show = false;
      this.maps[1].show = true;
      this.maps[2].show = false;
    }else if(this.selectedMap === this.maps[2]) {
      this.maps[0].show = false;
      this.maps[1].show = false;
      this.maps[2].show = true;
    }
    this.changeDetectorRef.detectChanges();
    this.drawLayers();
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

          } else {
          }

        }
      }
    });
  }

}
