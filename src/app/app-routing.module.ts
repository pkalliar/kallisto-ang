import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProtocolsComponent } from './protocols/protocols.component';
import { ContactComponent } from './entities/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';
import { ContactDetailComponent } from './entities/contact-detail.component';
import { LoginComponent } from './login.component';
import { IntroComponent } from './intro/intro.component';
import { ItemsComponent } from './inventory/items';
import { SkroutzComponent } from './skroutz/skroutz.component';


const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'intro',  component: IntroComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'items',     component: ItemsComponent },
  { path: 'detail/:id', component: ProtocolDetailComponent },
  { path: 'protocols',     component: ProtocolsComponent },
  { path: 'contacts',     component: ContactComponent },
  { path: 'contacts/:id',     component: ContactDetailComponent },
  { path: 'contacts/:id/edit',     component: ContactDetailComponent },
  { path: 'skroutz',     component: SkroutzComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
