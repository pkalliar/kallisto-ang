import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatToolbarModule,
  MatIconModule, MatInputModule, MatSortModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProtocolsComponent } from './protocols/protocols.component';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';
import { ProtocolService } from './protocols/protocol.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './entities/contact.component';
import { ContactDetailComponent } from './entities/contact-detail.component';
import { ContactService } from './entities/contact.service';
import { LoginComponent } from './login.component';



@NgModule({
  declarations: [
    AppComponent,
    ProtocolsComponent,
    ProtocolDetailComponent,
    DashboardComponent, LoginComponent,
    ContactComponent, ContactDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, CdkTableModule,
    MatIconModule, MatInputModule, MatSortModule, MatTableModule
  ],
  exports: [
    CdkTableModule],
  providers: [ProtocolService, ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
