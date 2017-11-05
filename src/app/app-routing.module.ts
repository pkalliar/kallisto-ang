import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProtocolsComponent } from './protocols/protocols.component';
import { ContactComponent } from './entities/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';
import { ContactDetailComponent } from './entities/contact-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'detail/:id', component: ProtocolDetailComponent },
  { path: 'protocols',     component: ProtocolsComponent },
  { path: 'contacts',     component: ContactComponent },
  { path: 'contacts/:id',     component: ContactDetailComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
