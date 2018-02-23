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
  MatDividerModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
// import { NgbModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

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
// import { LoginComponent } from './login.component';
import { LoginComponent } from './security/login/login.component';
import { IntroComponent } from './intro/intro.component';
// import { AuthService } from './auth/auth.service';
import { ItemsComponent } from './inventory/items';
import { ItemService } from './inventory/item.service';
import { SkroutzComponent } from './skroutz/skroutz.component';
import { SkroutzService } from './skroutz/skroutz.service';
import { AggeliesComponent } from './entities/classified-ads/classified-ads.component';
import { AggeliaDetailComponent} from './entities/classified-ads/ad-detail.component';
import { UserComponent } from './security/users/users.component';
import { UserDetailComponent} from './security/users/user-detail.component';
import { UserService} from './security/users/user.service';
import { PersonComponent } from './security/persons/persons.component';
import { PersonDetailComponent} from './security/persons/person-detail.component';
import { PersonService} from './security/persons/person.service';
import { PublicDealsComponent } from './public-deals/public-deals.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { UtilitiesService } from './services/utilities.service';

@NgModule({
  declarations: [
    AppComponent,
    ProtocolsComponent,
    ProtocolDetailComponent,
    ItemsComponent,
    DashboardComponent, LoginComponent, IntroComponent,
    ContactComponent, ContactDetailComponent, SkroutzComponent,
    AggeliesComponent, AggeliaDetailComponent,
    UserComponent, UserDetailComponent, PersonComponent, PersonDetailComponent, PublicDealsComponent
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
    MatNativeDateModule, MatDividerModule, MatListModule,
    ReactiveFormsModule, MatAutocompleteModule, MatExpansionModule,
    MatButtonModule, MatCheckboxModule, MatSliderModule, MatCardModule,
    MatSlideToggleModule, MatToolbarModule, CdkTableModule,
    MatIconModule, MatInputModule, MatSortModule, MatTableModule, MatChipsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule
    // NgbModule.forRoot()
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
    MatTooltipModule, MatDividerModule],
  providers: [ProtocolService, ContactService, PriorityService,
    ItemService, UserService, PersonService, AuthService, AuthGuard, UtilitiesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
