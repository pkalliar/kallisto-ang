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

// import { CrisisService }        from './crisis.service';

// import { CrisisCenterComponent }     from './crisis-center.component';
// import { CrisisListComponent }       from './crisis-list.component';
// import { CrisisCenterHomeComponent } from './crisis-center-home.component';
// import { CrisisDetailComponent }     from './crisis-detail.component';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms-routing.module';
import { AffairComponent } from './affair/affair.component';
import { AffairDetailComponent } from './affair/affair-detail.component';
import { AffairService } from './affair/affair.service';
import { FolderComponent } from './folder/folder.component';
import { FolderDetailComponent } from './folder/folder-detail.component';
import { FolderService } from './folder/folder.service';
import { ContactComponent } from './contact/contact.component';
import { ContactDetailComponent } from './contact/contact-detail.component';
import { ContactService } from './contact/contact.service';
import { ContactGroupDetailComponent } from './contact/contactgroup-detail.component';
import { ContactGroupService } from './contact/contactgroup.service';
import { ProtocolComponent } from './protocol/protocol.component';
import { ProtocolDetailComponent } from './protocol/protocol-detail.component';
import { ProtocolService } from './protocol/protocol.service';

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

    CommonModule,
    FormsModule,
    CmsRoutingModule
  ],
  declarations: [
    CmsComponent,
    AffairComponent, AffairDetailComponent,
    FolderComponent, FolderDetailComponent,
    ContactComponent, ContactDetailComponent, ContactGroupDetailComponent, ProtocolComponent, ProtocolDetailComponent
    // CrisisCenterComponent,
    // CrisisListComponent,
    // CrisisCenterHomeComponent,
    // CrisisDetailComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'el' },
    AffairService, FolderService, ContactService, ContactGroupService, ProtocolService
  ],
  bootstrap: [CmsComponent]
})
export class CmsModule {}
