import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { environment } from '../environments/environment';

import { RouterModule } from '@angular/router';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProtocolsComponent } from './protocols/protocols.component';
import { ProtocolDetailComponent } from './protocols/protocol-detail.component';
import { ProtocolService } from './protocols/protocol.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './entities/contact.component';
import { ContactDetailComponent } from './entities/contact-detail.component';
import { ContactService } from './entities/contact.service';
import { PriorityService } from './entities/priority.service';
import { LoginComponent } from './login.component';
import { AuthService } from './auth/auth.service';
import { ItemsComponent } from './inventory/items';
import { ItemService } from './inventory/item.service';



@NgModule({
  declarations: [
    AppComponent, 
    ProtocolsComponent,
    ProtocolDetailComponent,
    ItemsComponent,
    DashboardComponent, LoginComponent,
    ContactComponent, ContactDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule, MatGridListModule,
    BrowserAnimationsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule, HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule, MatAutocompleteModule, MatExpansionModule,
    MatButtonModule, MatCheckboxModule, MatSliderModule,
    MatSlideToggleModule, MatToolbarModule, CdkTableModule,
    MatIconModule, MatInputModule, MatSortModule, MatTableModule, MatChipsModule
  ],
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
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
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule],
  providers: [ProtocolService, ContactService, AuthService, PriorityService, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
