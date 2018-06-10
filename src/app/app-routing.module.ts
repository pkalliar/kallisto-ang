import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { DashboardComponent } from './dashboard/dashboard.component';

import { LoginComponent } from './security/login/login.component';
import { IntroComponent } from './intro/intro.component';
import { UserComponent } from './security/users/users.component';
import { UserDetailComponent} from './security/users/user-detail.component';
import { PersonComponent } from './security/persons/persons.component';
import { PersonDetailComponent} from './security/persons/person-detail.component';

import { CmsComponent } from './cms/cms.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // {
  //   path: 'cms',
  //   loadChildren: 'app/cms/cms.module#CmsModule',
  //   data: { preload: true }
  // },
  // {
  //   path: 'cms',
  //   component: CmsComponent
  // },
  // { path: 'crisis-center', component: CmsComponent },
  { path: 'intro',  component: IntroComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'login/:goto',  component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'users',     component: UserComponent },
  { path: 'users/:id',     component: UserDetailComponent },
  { path: 'users/:id/edit',     component: UserDetailComponent },
  { path: 'persons',     component: PersonComponent },
  { path: 'persons/:id',     component: PersonDetailComponent },
  { path: 'persons/:id/edit',     component: PersonDetailComponent },
  { path: 'testfb',  component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
