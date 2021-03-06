import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { environment } from '../environments/environment';

import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpClientModule, HttpUrlEncodingCodec} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {CdkTableModule} from '@angular/cdk/table';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
// import { NgbModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

// import { Firebase } from 'firebase';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TopnavComponent } from './topnav/topnav.component';

import { EshopModule } from './eshop/eshop.module';
import { EshopRoutingModule } from './eshop/eshop-routing.module';
import { CmsModule } from './cms/cms.module';
import { CmsRoutingModule } from './cms/cms-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
// import { ContactComponent } from './entities/contact.component';
// import { ContactDetailComponent } from './entities/contact-detail.component';
// import { ContactService } from './entities/contact.service';
// import { PriorityService } from './entities/priority.service';
// import { LoginComponent } from './login.component';

// SECURITY MODULES
import { SecurityModule } from './security/security.module';
// import { LoginComponent } from './security/login/login.component';
// import { UserComponent } from './security/users/users.component';
// import { UserDetailComponent} from './security/users/user-detail.component';
// import { UserService} from './security/users/user.service';
// import { PersonComponent } from './security/persons/persons.component';
// import { PersonDetailComponent} from './security/persons/person-detail.component';
// import { PersonService} from './security/persons/person.service';


import { IntroComponent } from './intro/intro.component';
// import { AuthService } from './auth/auth.service';
// import { ItemsComponent } from './inventory/items';
// import { ItemService } from './inventory/item.service';
// import { SkroutzComponent } from './skroutz/skroutz.component';
// import { SkroutzService } from './skroutz/skroutz.service';
// import { AggeliesComponent } from './entities/classified-ads/classified-ads.component';
// import { AggeliaDetailComponent} from './entities/classified-ads/ad-detail.component';

// import { PublicDealsComponent } from './public-deals/public-deals.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { UtilitiesService } from './services/utilities.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { UserService } from './security/users/user.service';
import { PersonService } from './security/persons/person.service';
import { TopnavService } from './topnav/topnav.service';

@NgModule({
  declarations: [
    AppComponent, TopnavComponent,
    DashboardComponent, IntroComponent,
    // ProtocolsComponent,
    // ProtocolDetailComponent,
    // ItemsComponent,
    // ContactComponent, ContactDetailComponent, SkroutzComponent,
    // AggeliesComponent, AggeliaDetailComponent,
    // LoginComponent, UserComponent, UserDetailComponent, PersonComponent, PersonDetailComponent
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
    MatButtonModule, MatCheckboxModule, MatSliderModule, MatCardModule, MatProgressSpinnerModule,
    MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatTooltipModule, CdkTableModule,
    MatIconModule, MatInputModule, MatSortModule, MatTableModule, MatChipsModule,

    // applications
    SecurityModule, EshopModule, EshopRoutingModule, CmsModule, CmsRoutingModule,

    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
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
  providers: [
    // ProtocolService, ContactService, PriorityService, ItemService,
    UserService, PersonService, TopnavService,
    AuthService, AuthGuard, UtilitiesService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor,  multi: true  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    // Diagnostic only: inspect router configuration
    constructor(router: Router) {
      // console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
    }
}
