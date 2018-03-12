import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemsComponent } from './inventory/items';
import { SkroutzComponent } from './skroutz/skroutz.component';
import { AdsComponent } from './advertisement/advertisements.component';

const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },

  { path: 'skroutz', component: SkroutzComponent },
  { path: 'aggelies', component: AdsComponent},

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class EshopRoutingModule {}
