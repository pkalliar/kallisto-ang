import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemsComponent } from './inventory/items';
import { SkroutzComponent } from './skroutz/skroutz.component';
import { AdsComponent } from './advertisement/advertisements.component';
import { AdDetailComponent } from './advertisement/ad-detail.component';
import { EshopComponent } from './eshop.component';
import { CreateAdComponent } from './advertisement/create-ad/create-ad.component';
import { AppointmentsComponent } from './appointment/appointments/appointments.component';

const routes: Routes = [
  { path: 'eshop', component: EshopComponent },

  { path: 'eshop/skroutz', component: SkroutzComponent },
  { path: 'eshop/create-ad', component: CreateAdComponent },
  { path: 'eshop/aggelies', component: AdsComponent},
  { path: 'eshop/aggelies/:id',     component: AdDetailComponent },
  { path: 'eshop/aggelies/:id/edit',     component: AdDetailComponent },
  { path: 'eshop/appointments', component: AppointmentsComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class EshopRoutingModule {}
