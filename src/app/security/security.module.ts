import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { environment } from '../../environments/environment';

import { RouterModule } from '@angular/router';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpClientModule, HttpUrlEncodingCodec} from '@angular/common/http';
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
  MatDividerModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';


import { LoginComponent } from './login/login.component';

import { PersonComponent } from './persons/persons.component';
import { PersonDetailComponent} from './persons/person-detail.component';
import { PersonService} from './persons/person.service';
import { UserComponent } from './users/users.component';
// import { RoutingModule } from './cms-routing.module';
import { UserDetailComponent } from './users/user-detail.component';
import { UserService } from './users/user.service';

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
    MatNativeDateModule, MatDividerModule, MatListModule,
    ReactiveFormsModule, MatAutocompleteModule, MatExpansionModule,
    MatButtonModule, MatCheckboxModule, MatSliderModule, MatCardModule,
    MatSlideToggleModule, MatToolbarModule, MatTooltipModule, CdkTableModule,
    MatIconModule, MatInputModule, MatSortModule, MatTableModule, MatChipsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    // CmsRoutingModule
  ],
  declarations: [
    UserComponent, LoginComponent, UserDetailComponent,
    PersonComponent, PersonDetailComponent
    // AffairComponent, AffairDetailComponent,
    // FolderComponent, FolderDetailComponent,
    // ContactComponent, ContactDetailComponent, ContactGroupDetailComponent, ProtocolComponent, ProtocolDetailComponent

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'el' },
    // AffairService, FolderService, ContactService, ContactGroupService, ProtocolService
  ],
  bootstrap: [UserComponent]
})
export class SecurityModule {}
