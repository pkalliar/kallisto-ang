import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemsComponent } from './inventory/items';
import { SkroutzComponent } from './skroutz/skroutz.component';
import { AdsComponent } from './advertisement/advertisements.component';
import { AdDetailComponent } from './advertisement/ad-detail.component';
import { EshopComponent } from './eshop.component';

const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'eshop', component: EshopComponent },

  { path: 'skroutz', component: SkroutzComponent },
  { path: 'aggelies', component: AdsComponent},
  { path: 'aggelies/:id',     component: AdDetailComponent },
  { path: 'aggelies/:id/edit',     component: AdDetailComponent },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class EshopRoutingModule {}
