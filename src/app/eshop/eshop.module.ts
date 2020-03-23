import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el';
registerLocaleData(localeEl, 'el');
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { environment } from '../../environments/environment';

import { RouterModule } from '@angular/router';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpClientModule, HttpUrlEncodingCodec} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {CdkTableModule} from '@angular/cdk/table';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {FileUploadModule} from 'ng2-file-upload';

import { EshopComponent } from './eshop.component';
import { SkroutzComponent } from './skroutz/skroutz.component';
import { SkroutzService } from './skroutz/skroutz.service';
import { ItemsComponent } from './inventory/items';
import { AdDetailComponent } from './advertisement/advertisement-detail/ad-detail.component';
import { AdsComponent} from './advertisement/advertisements/advertisements.component';
import {AdsService} from './advertisement/advertisements.service';

// import { CrisisService }        from './crisis.service';

// import { CrisisCenterComponent }     from './crisis-center.component';
// import { CrisisListComponent }       from './crisis-list.component';
// import { CrisisCenterHomeComponent } from './crisis-center-home.component';
// import { CrisisDetailComponent }     from './crisis-detail.component';

import { EshopRoutingModule } from './eshop-routing.module';
import { CreateAdComponent } from './advertisement/create-ad/create-ad.component';

import { AppointmentsComponent } from './appointment/appointments/appointments.component';
import { AppointmentDetailComponent } from './appointment/appointment-detail/appointment-detail.component';
import { AppointmentSlotsComponent, AppointmentSlotDialogComponent } from './appointment/appointment-slots/appointment-slots.component';

// import { CloudinaryModule } from '@cloudinary/angular-5.x';
// import * as  Cloudinary from 'cloudinary-core';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import cloudinaryConfiguration from './config';
import { PhotoUploadComponent } from './advertisement/photo-album/photo-upload.component';
import { PhotoListComponent } from './advertisement/photo-list/photo-list.component';
import {PhotoAlbum} from './advertisement/photo-album.service';
import {MapLocatorComponent} from './advertisement/map-locator/map-locator.component';
import { TopnavService } from '../topnav/topnav.service';
import { HeremapComponent } from './maps/heremap/heremap.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { GmapComponent } from './maps/gmap/gmap.component';
import { MapDialogComponent } from './maps/map-dialog/map-dialog.component';
import { NavtexDetailComponent } from './maps/navtex-detail/navtex-detail.component';
import { NavtexListComponent } from './maps/navtex-list/navtex-list.component';
import { FilterPipe} from './maps/navtex-list/filter.pipe';
import { MapLayersComponent } from './maps/map-layers/map-layers.component';
import { ContainerComponent } from './maps/container/container.component';
import { LeafmapComponent } from './maps/leafmap/leafmap.component';
import { OpenLayersMapComponent } from './maps/open-layers-map/open-layers-map.component';
import { MongoService } from './maps/mongo.service';
import { CalendarComponent } from './appointment/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';

export const cloudinary = {
  Cloudinary: CloudinaryCore
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatGridListModule,
    BrowserAnimationsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule, HttpClientModule,
    MatNativeDateModule, MatDialogModule, MatDividerModule, MatListModule, MatSelectModule,
    ReactiveFormsModule, MatAutocompleteModule, MatExpansionModule,
    MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatSliderModule, MatCardModule,
    MatSlideToggleModule, MatToolbarModule, MatTooltipModule, CdkTableModule,
    MatIconModule, MatInputModule, MatProgressSpinnerModule,
    MatRadioModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatChipsModule,
    MatDatepickerModule, MatSidenavModule, DragDropModule,
    AngularFirestoreModule, AngularFireAuthModule,
    NgbModule,
    FileUploadModule,
    CommonModule,
    FormsModule, FullCalendarModule,
    EshopRoutingModule,
    // CloudinaryModule.forRoot(cloudinary, cloudinaryConfiguration),
    CloudinaryModule.forRoot(cloudinary, {
      cloud_name: 'pkenergy',
      upload_preset: 'ecnvvbwv'
  }),
  ],
  entryComponents: [
    AppointmentSlotsComponent, AppointmentSlotDialogComponent, MapDialogComponent
  ],
  declarations: [
    EshopComponent,
    SkroutzComponent, PhotoUploadComponent, PhotoListComponent, MapLocatorComponent,
    ItemsComponent,
    AdsComponent, AdDetailComponent, CreateAdComponent, CalendarComponent,
    AppointmentsComponent, AppointmentDetailComponent, AppointmentSlotsComponent, AppointmentSlotDialogComponent,
    HeremapComponent, GmapComponent, MapDialogComponent, NavtexDetailComponent,
    NavtexListComponent, FilterPipe, MapLayersComponent, ContainerComponent, LeafmapComponent, OpenLayersMapComponent
    // CrisisCenterComponent,
    // CrisisListComponent,
    // CrisisCenterHomeComponent,
    // CrisisDetailComponent
  ],
  bootstrap: [AppointmentSlotsComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'el' },
    AdsService, SkroutzService, PhotoAlbum, TopnavService, MongoService
  ]
})
export class EshopModule {


}
