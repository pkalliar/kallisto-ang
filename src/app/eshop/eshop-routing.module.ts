import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemsComponent } from './inventory/items';
import { SkroutzComponent } from './skroutz/skroutz.component';
import { AdsComponent } from './advertisement/advertisements/advertisements.component';
import { AdDetailComponent } from './advertisement/advertisement-detail/ad-detail.component';
import { EshopComponent } from './eshop.component';
import { CreateAdComponent } from './advertisement/create-ad/create-ad.component';
import { AppointmentsComponent } from './appointment/appointments/appointments.component';
import { AppointmentDetailComponent } from './appointment/appointment-detail/appointment-detail.component';
import { AppointmentSlotsComponent } from './appointment/appointment-slots/appointment-slots.component';
import { MapComponent } from './maps/map/map.component';
import { GmapComponent } from './maps/gmap/gmap.component';

const routes: Routes = [
  { path: 'eshop', component: EshopComponent },

  { path: 'eshop/skroutz', component: SkroutzComponent },
  { path: 'eshop/create-ad', component: CreateAdComponent },
  { path: 'eshop/aggelies', component: AdsComponent},
  { path: 'eshop/aggelies/:id',     component: AdDetailComponent },
  { path: 'eshop/aggelies/:id/edit',     component: AdDetailComponent },
  { path: 'eshop/appointments', component: AppointmentsComponent },
  { path: 'eshop/appointments/:id',     component: AppointmentDetailComponent },
  { path: 'eshop/appointments/:id/edit',     component: AppointmentDetailComponent },
  { path: 'eshop/app-slots', component: AppointmentSlotsComponent },
  { path: 'eshop/maps', component: MapComponent },
  { path: 'maps', component: MapComponent },
  { path: 'eshop/gmaps', component: GmapComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class EshopRoutingModule {}
