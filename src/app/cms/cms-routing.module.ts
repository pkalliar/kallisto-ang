import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FolderComponent } from './folder/folder.component';
import { FolderDetailComponent } from './folder/folder-detail.component';
import { CmsComponent } from './cms.component';
import { ContactComponent } from './contact/contact.component';
import { ContactDetailComponent } from './contact/contact-detail.component';
import { ContactGroupDetailComponent } from './contact/contactgroup-detail.component';
import { AffairComponent } from './affair/affair.component';
import { AffairDetailComponent } from './affair/affair-detail.component';
import { ProtocolComponent } from './protocol/protocol.component';
import { ProtocolDetailComponent } from './protocol/protocol-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'contacts',     component: ContactComponent },
  { path: 'contacts/search/:filterCriteria',     component: ContactComponent },
  { path: 'contacts/:id',     component: ContactDetailComponent },
  { path: 'contacts/:id/edit',     component: ContactDetailComponent },
  { path: 'contact-groups/:id',     component: ContactGroupDetailComponent },
  { path: 'contact-groups/:id/edit',     component: ContactGroupDetailComponent },
  { path: 'folders',     component: FolderComponent },
  { path: 'folders/:id',     component: FolderDetailComponent },
  { path: 'folders/:id/edit',     component: FolderDetailComponent },
  { path: 'affairs',     component: AffairComponent },
  { path: 'affairs/:id',     component: AffairDetailComponent },
  { path: 'affairs/:id/edit',     component: AffairDetailComponent },
  { path: 'protocols',     component: ProtocolComponent },
  { path: 'protocols/:id',     component: ProtocolDetailComponent },
  { path: 'protocols/:id/edit',     component: ProtocolDetailComponent }
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CmsRoutingModule {}
