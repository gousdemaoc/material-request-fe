import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {NoAuthComponent} from './components/no-auth/no-auth.component';
import {AppComponent} from './app.component';

const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'welcome/:requestID', component: WelcomeComponent },
  { path: 'nope', component: NoAuthComponent },
  { path: 'nope/:requestID', component: NoAuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
