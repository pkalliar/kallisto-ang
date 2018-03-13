import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FolderComponent } from './folder/folder.component';
import { CmsComponent } from './cms.component';


// const routes: Routes = [
//   { path: '', redirectTo: 'cms/intro', pathMatch: 'full' },
//   { path: 'cms/intro',     component: FolderComponent },
// ];

const routes: Routes = [
  {
    path: '',
    component: CmsComponent,
    children: [
      {
        path: 'folders',
        component: FolderComponent,
        // children: [
        //   {
        //     path: ':id',
        //     component: CrisisDetailComponent,
        //     canDeactivate: [CanDeactivateGuard],
        //     resolve: {
        //       crisis: CrisisDetailResolver
        //     }
        //   },
        //   {
        //     path: '',
        //     component: CrisisCenterHomeComponent
        //   }
        // ]
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CmsRoutingModule {}
