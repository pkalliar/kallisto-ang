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

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';


import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatDividerModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

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
import { MapComponent } from './maps/map/map.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { GmapComponent } from './maps/gmap/gmap.component';
import { MapDialogComponent } from './maps/map-dialog/map-dialog.component';
import { NavtexDetailComponent } from './maps/navtex-detail/navtex-detail.component';
import { NavtexListComponent } from './maps/navtex-list/navtex-list.component';

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
    MatButtonModule, MatCheckboxModule, MatSliderModule, MatCardModule,
    MatSlideToggleModule, MatToolbarModule, MatTooltipModule, CdkTableModule,
    MatIconModule, MatInputModule, MatProgressSpinnerModule,
    MatRadioModule, MatSortModule, MatStepperModule, MatTableModule, MatChipsModule,
    MatDatepickerModule,
    AngularFirestoreModule, AngularFireAuthModule,
    NgbModule,
    FileUploadModule,
    CommonModule,
    FormsModule,
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
    AdsComponent, AdDetailComponent, CreateAdComponent,
    AppointmentsComponent, AppointmentDetailComponent, AppointmentSlotsComponent, AppointmentSlotDialogComponent,
    MapComponent, GmapComponent, MapDialogComponent, NavtexDetailComponent, NavtexListComponent
    // CrisisCenterComponent,
    // CrisisListComponent,
    // CrisisCenterHomeComponent,
    // CrisisDetailComponent
  ],
  bootstrap: [AppointmentSlotsComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'el' },
    AdsService, SkroutzService, PhotoAlbum, TopnavService
  ]
})
export class EshopModule {


}
